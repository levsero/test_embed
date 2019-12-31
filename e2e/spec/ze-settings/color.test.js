import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'
import { queries } from 'pptr-testing-library'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'

const applySettings = settings =>
  page.evaluate(settings => zE('webWidget', 'updateSettings', settings), settings)
const openWidget = async () => {
  await launcher.click()
  await waitForHelpCenter()
}

const defaultThemeColor = 'rgb(183, 74, 30)'
const getHeaderColor = async () =>
  await widget.evaluate(() => {
    return getComputedStyle(document.querySelector('h1').parentElement.parentElement)
      .backgroundColor
  })

const getBackgroundColor = selector =>
  getComputedStyle(document.querySelector(selector)).backgroundColor
const getColor = selector => getComputedStyle(document.querySelector(selector)).color

const getLauncherColor = () => launcher.evaluate(getBackgroundColor, 'button')
const getFooterButtonColor = () => widget.evaluate(getBackgroundColor, 'footer button')
const getListItemColor = () => widget.evaluate(getColor, 'ol li a:not(:focus)')
const getLinkColor = () => widget.evaluate(getColor, 'a#for-testing')

const validatesColors = (applyColorSetting, getColor, defaultColor = defaultThemeColor) => {
  describe('when passed nonsense', () => {
    it('does not change the color', async () => {
      await applyColorSetting('zorgtown')
      expect(await getColor()).toEqual(defaultColor)
    })
  })

  describe('when passed nothing', () => {
    it('does not change the color', async () => {
      await applyColorSetting()
      expect(await getColor()).toEqual(defaultColor)
    })
  })
}

const applyColorSetting = colorSetting =>
  applySettings({
    webWidget: {
      color: {
        ...colorSetting
      }
    }
  })

beforeEach(async () => {
  await loadWidget()
    .withPresets('helpCenterWithContextualHelp', 'contactForm')
    .intercept(mockSearchEndpoint())
    .load()
})

describe('zESettings.webWidget.color.theme', () => {
  describe('when passed valid hex', () => {
    beforeEach(async () => {
      await applyColorSetting({ theme: '#0000ff' })
    })

    it('sets the launcher color to that value', async () => {
      expect(await getLauncherColor()).toEqual('rgb(0, 0, 255)')
    })

    it('adjusts the colors for other parts of the widget too', async () => {
      await openWidget()
      expect(await getHeaderColor()).toEqual('rgb(0, 0, 255)')
      expect(await getListItemColor()).toEqual('rgb(0, 0, 255)')

      const doc = await widget.getDocument()
      const link = await queries.getByText(doc, 'How do I publish my content in other languages?')
      await link.click()

      expect(await getLinkColor()).toEqual('rgb(0, 0, 255)')
    })
  })

  validatesColors(theme => applyColorSetting({ theme }), getLauncherColor)
})

describe('zESettings.webWidget.color.launcher', () => {
  describe('when passed valid hex', () => {
    beforeEach(async () => {
      await applyColorSetting({ launcher: '#0000ff' })
    })

    it('sets the launcher color to that value', async () => {
      expect(await getLauncherColor()).toEqual('rgb(0, 0, 255)')
    })

    it('does not set the color for the widget', async () => {
      await openWidget()
      expect(await getHeaderColor()).toEqual(defaultThemeColor)
    })
  })

  validatesColors(launcher => applyColorSetting({ launcher }), getLauncherColor)
})

describe('zESettings.webWidget.color.launcherText', () => {
  const getLauncherTextColor = () => launcher.evaluate(getColor, 'button')

  describe('when passed valid hex', () => {
    beforeEach(async () => {
      await applyColorSetting({ launcherText: '#0000ff' })
    })

    it('sets the launcher text color to that value', async () => {
      expect(await getLauncherTextColor()).toEqual('rgb(0, 0, 255)')
    })
  })

  validatesColors(
    launcherText => applyColorSetting({ launcherText }),
    getLauncherTextColor,
    'rgb(255, 255, 255)'
  )
})

describe('zESettings.webWidget.color.button', () => {
  describe('when passed valid hex', () => {
    beforeEach(async () => {
      await applyColorSetting({ button: '#0000ff' })
      await openWidget()
    })

    it('sets the button color to that value', async () => {
      expect(await getFooterButtonColor()).toEqual('rgb(0, 0, 255)')
    })
  })

  validatesColors(async button => {
    await applyColorSetting({ button })
    await openWidget()
  }, getFooterButtonColor)
})

describe('zESettings.webWidget.color.resultLists', () => {
  beforeEach(async () => {
    await openWidget()
  })

  describe('when passed valid hex', () => {
    it('sets the search results list link color to that value', async () => {
      await applyColorSetting({ resultLists: '#0000ff' })
      expect(await getListItemColor()).toEqual('rgb(0, 0, 255)')
    })
  })

  validatesColors(resultLists => applyColorSetting({ resultLists }), getListItemColor)
})

describe('zESettings.webWidget.color.header', () => {
  beforeEach(async () => {
    await openWidget()
  })

  describe('when passed valid hex', () => {
    it('sets the header color to that value', async () => {
      await applyColorSetting({ header: '#0000ff' })
      expect(await getHeaderColor()).toEqual('rgb(0, 0, 255)')
    })
  })

  validatesColors(header => applyColorSetting({ header }), getHeaderColor)
})

describe('zESettings.webWidget.color.articleLinks', () => {
  beforeEach(async () => {
    await openWidget()
    const doc = await widget.getDocument()
    const link = await queries.getByText(doc, 'How do I publish my content in other languages?')
    await link.click()
  })

  describe('when passed valid hex', () => {
    it('sets the article link color to that value', async () => {
      await applyColorSetting({ articleLinks: '#0000ff' })
      expect(await getLinkColor()).toEqual('rgb(0, 0, 255)')
    })
  })

  validatesColors(articleLinks => applyColorSetting({ articleLinks }), getLinkColor)
})
