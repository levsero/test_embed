import loadWidget from 'e2e/helpers/widget-page/fluent'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { wait } from 'pptr-testing-library'
import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'

const getPosition = async selector => {
  return await page.evaluate(iframe => {
    const frame = document.querySelector(iframe)
    return {
      right: frame.style.right,
      bottom: frame.style.bottom
    }
  }, selector)
}

const buildWidget = mobile => {
  let builder = loadWidget().withPresets('helpCenter')
  if (mobile) builder = builder.useMobile()
  return builder
}

describe('desktop', () => {
  const setup = (mobile = false) => {
    return buildWidget(mobile)
      .evaluateOnNewDocument(() => {
        window.zESettings = {
          offset: {
            horizontal: '100px',
            vertical: '150px'
          }
        }
      })
      .load()
  }

  test('adjusts the position of launcher', async () => {
    await setup()
    expect(await getPosition(launcher.selector)).toEqual({
      right: '100px',
      bottom: '150px'
    })
  })

  test('adjusts the position of widget', async () => {
    await setup()
    await widget.openByKeyboard()
    await waitForHelpCenter()

    await wait(async () => {
      expect(await getPosition(widget.selector)).toEqual({
        right: '100px',
        bottom: '150px'
      })
    })
  })

  test('does not affect mobile position', async () => {
    await setup(true)
    expect(await getPosition(launcher.selector)).toEqual({
      right: '0px',
      bottom: '0px'
    })
    await widget.openByKeyboard()
    await waitForHelpCenter()
    expect(await getPosition(widget.selector)).toEqual({
      right: '',
      bottom: ''
    })
  })
})

describe('mobile', () => {
  const setup = (mobile = true) => {
    return buildWidget(mobile)
      .evaluateOnNewDocument(() => {
        window.zESettings = {
          offset: {
            mobile: {
              horizontal: '230px',
              vertical: '100px'
            }
          }
        }
      })
      .load()
  }

  test('adjusts the position of launcher', async () => {
    await setup()
    expect(await getPosition(launcher.selector)).toEqual({
      right: '230px',
      bottom: '100px'
    })
  })

  test('does not affect the position of the widget', async () => {
    await setup()
    await widget.openByKeyboard()
    await waitForHelpCenter()

    await wait(async () => {
      expect(await getPosition(widget.selector)).toEqual({
        right: '',
        bottom: ''
      })
    })
  })

  test('does not affect desktop position', async () => {
    await setup(false)
    expect(await getPosition(launcher.selector)).toEqual({
      right: '0px',
      bottom: '0px'
    })
    await widget.openByKeyboard()
    await waitForHelpCenter()
    await wait(async () => {
      expect(await getPosition(widget.selector)).toEqual({
        right: '0px',
        bottom: '0px'
      })
    })
  })
})
