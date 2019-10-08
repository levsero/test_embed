import widgetPage from '../../helpers/widget-page'
import launcher from '../../helpers/launcher'

const applySettings = settings =>
  page.evaluate(settings => zE('webWidget', 'updateSettings', settings), settings)

const applyColorSetting = setting =>
  applySettings({
    webWidget: {
      color: {
        theme: setting
      }
    }
  })

const defaultThemeColor = 'rgb(183, 74, 30)'
const themeColor = () => getComputedStyle(document.querySelector('button')).backgroundColor

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter')
})

describe('zESettings.webWidget.color.theme', () => {
  let launcherFrame

  beforeEach(async () => {
    launcherFrame = await launcher.getFrame()
  })

  describe('when passed valid hex', () => {
    it('sets the color to that value', async () => {
      await applyColorSetting('#0000ff')

      expect(await launcherFrame.evaluate(themeColor)).toEqual('rgb(0, 0, 255)')
    })
  })

  describe('when passed nonsense', () => {
    it('does not change the color', async () => {
      await applyColorSetting('zorgtown')

      expect(await launcherFrame.evaluate(themeColor)).toEqual(defaultThemeColor)
    })
  })

  describe('when passed nothing', () => {
    it('does not change the color', async () => {
      await applyColorSetting()

      expect(await launcherFrame.evaluate(themeColor)).toEqual(defaultThemeColor)
    })
  })
})
