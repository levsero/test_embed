import { queries } from 'pptr-testing-library'
import widgetPage from '../helpers/widget-page'
import launcher from '../helpers/launcher'
import widget from '../helpers/widget'

describe('zopim apis', () => {
  beforeEach(async () => {
    await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
  })

  test('$zopim.livechat.window.getDisplay()', async () => {
    expect(await page.evaluate(() => $zopim.livechat.window.getDisplay())).toEqual(false)
    await launcher.click()
    expect(await page.evaluate(() => $zopim.livechat.window.getDisplay())).toEqual(true)
  })

  test('$zopim.livechat.window.toggle()', async () => {
    await page.evaluate(() => $zopim.livechat.window.toggle())

    await page.waitForSelector('iframe#launcher', {
      hidden: true
    })
    await page.waitForSelector('iframe#webWidget', {
      visible: true
    })
    await page.evaluate(() => $zopim.livechat.window.toggle())
    await page.waitForSelector('iframe#launcher', {
      visible: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
  })

  test('$zopim.livechat.window.hide()', async () => {
    await page.evaluate(() => $zopim.livechat.window.hide())
    await page.waitForSelector('iframe#launcher', {
      hidden: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
  })

  test('$zopim.livechat.button.hide()', async () => {
    await page.evaluate(() => $zopim.livechat.button.hide())
    await page.waitForSelector('iframe#launcher', {
      hidden: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
  })

  test('$zopim.livechat.hideAll()', async () => {
    await page.evaluate(() => $zopim.livechat.hideAll())
    await page.waitForSelector('iframe#launcher', {
      hidden: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
  })

  test('$zopim.livechat.button.show()', async () => {
    await page.evaluate(() => $zopim.livechat.button.hide())
    await page.evaluate(() => $zopim.livechat.button.show())
    await page.waitForSelector('iframe#launcher', {
      visible: true
    })
    await page.waitForSelector('iframe#webWidget', {
      hidden: true
    })
  })

  test('$zopim.livechat.setLanguage(locale)', async () => {
    await page.evaluate(() => {
      $zopim.livechat.setLanguage('fr')
    })

    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')
  })

  test('$zopim.livechat.window.onShow(cb)', async () => {
    await page.evaluate(() => {
      $zopim.livechat.window.onShow(() => (window.onOpenCalled = true))
    })

    await launcher.click()
    const result = await page.evaluate(() => window.onOpenCalled)
    expect(result).toEqual(true)
  })

  test('$zopim.livechat.window.onHide(cb)', async () => {
    await page.evaluate(() => {
      $zopim.livechat.window.onHide(() => (window.onCloseCalled = true))
    })

    await launcher.click()
    await widget.close()
    const result = await page.evaluate(() => window.onCloseCalled)
    expect(result).toEqual(true)
  })

  describe('$zopim.livechat.window.show()', () => {
    test('initially launcher', async () => {
      await page.evaluate(() => $zopim.livechat.window.show())

      await page.waitForSelector('iframe#webWidget', {
        visible: true
      })
      await page.waitForSelector('iframe#launcher', {
        hidden: true
      })
    })

    test('initially hidden', async () => {
      await page.evaluate(() => $zopim.livechat.window.hide())
      await page.evaluate(() => $zopim.livechat.window.show())
      await page.waitForSelector('iframe#webWidget', {
        visible: true
      })
      await page.waitForSelector('iframe#launcher', {
        hidden: true
      })
    })
  })
})
