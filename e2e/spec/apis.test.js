import { queries } from 'pptr-testing-library'
import widgetPage from '../helpers/widget-page'
import widget from '../helpers/widget'
import launcher from '../helpers/launcher'

describe('apis', () => {
  beforeEach(async () => {
    await widgetPage.loadWithConfig('helpCenter')
  })

  test("zE('webWidget:get', 'display')", async () => {
    let result = await page.evaluate(() => zE('webWidget:get', 'display'))
    expect(result).toEqual('launcher')

    await launcher.click()
    result = await page.evaluate(() => zE('webWidget:get', 'display'))
    expect(result).toEqual('helpCenter')

    await page.evaluate(() => zE('webWidget', 'hide'))
    result = await page.evaluate(() => zE('webWidget:get', 'display'))
    expect(result).toEqual('hidden')
  })

  test("zE('webWidget', 'hide') and zE('webWidget', 'show')", async () => {
    await page.evaluate(() => zE('webWidget', 'hide'))
    await launcher.isHidden()
    await widget.isHidden()
    await page.evaluate(() => zE('webWidget', 'show'))
    await launcher.isVisible()
    await widget.isHidden()
  })

  describe("zE('webWidget', 'show')", () => {
    test('launcher is visible', async () => {
      await page.evaluate(() => zE('webWidget', 'show'))
      await launcher.isVisible()
      await widget.isHidden()
    })

    test('widget is visible', async () => {
      await launcher.click()
      await page.evaluate(() => zE('webWidget', 'show'))
      await launcher.isHidden()
      await widget.isVisible()
    })
  })

  describe("zE('webWidget', 'hide')", () => {
    test('launcher is visible', async () => {
      await page.evaluate(() => zE('webWidget', 'hide'))
      await launcher.isHidden()
      await widget.isHidden()
    })

    test('widget is visible', async () => {
      await launcher.click()
      await page.evaluate(() => zE('webWidget', 'hide'))
      await launcher.isHidden()
      await widget.isHidden()
    })

    test('called multiple times', async () => {
      await page.evaluate(() => zE('webWidget', 'hide'))
      await page.evaluate(() => zE('webWidget', 'hide'))
      await page.evaluate(() => zE('webWidget', 'hide'))
      await launcher.isHidden()
      await widget.isHidden()
    })
  })

  test("zE('webWidget', 'open')", async () => {
    await page.evaluate(() => zE('webWidget', 'open'))
    await widget.isVisible()
    await launcher.isHidden()
  })

  test("zE('webWidget', 'open')", async () => {
    await page.evaluate(() => zE('webWidget', 'open'))
    await widget.isVisible()
    await launcher.isHidden()
  })

  test("zE('webWidget', 'close')", async () => {
    await page.evaluate(() => zE('webWidget', 'open'))
    await page.evaluate(() => zE('webWidget', 'close'))
    await widget.isHidden()
    await launcher.isVisible()
  })

  describe("zE('webWidget:on', 'open', fn)", () => {
    test('with user action', async () => {
      await page.evaluate(() => {
        zE('webWidget:on', 'open', () => {
          window.onOpenCalled = true
        })
      })

      await launcher.click()
      const result = await page.evaluate(() => window.onOpenCalled)
      expect(result).toEqual(true)
    })

    test('with apis', async () => {
      await page.evaluate(() => {
        zE('webWidget:on', 'open', () => {
          window.onOpenCalledWithApi = true
        })
      })
      await page.evaluate(() => zE('webWidget', 'open'))
      const result = await page.evaluate(() => window.onOpenCalledWithApi)
      expect(result).toEqual(true)
    })
  })

  describe("zE('webWidget:on', 'close', fn)", () => {
    test('with user action', async () => {
      await page.evaluate(() => {
        zE('webWidget:on', 'close', () => {
          window.onCloseCalled = true
        })
      })

      await launcher.click()
      await widget.close()
      const result = await page.evaluate(() => window.onCloseCalled)
      expect(result).toEqual(true)
    })

    test('with apis', async () => {
      await page.evaluate(() => {
        zE('webWidget:on', 'close', () => {
          window.onCloseCalledWithApi = true
        })
      })
      await page.evaluate(() => zE('webWidget', 'open'))
      await page.evaluate(() => zE('webWidget', 'close'))
      const result = await page.evaluate(() => window.onCloseCalledWithApi)
      expect(result).toEqual(true)
    })
  })

  test("zE('webWidget', 'setLocale', locale)", async () => {
    await page.evaluate(() => {
      zE('webWidget', 'setLocale', 'fr')
    })

    expect(await queries.getNodeText(await launcher.getLabel())).toEqual('Aide')
  })

  describe("zE('webWidget', 'toggle')", () => {
    test('toggling', async () => {
      await page.evaluate(() => zE('webWidget', 'toggle'))
      await launcher.isHidden()
      await widget.isVisible()
      expect(await page.evaluate(() => zE('webWidget:get', 'display'))).toEqual('helpCenter')
      await page.evaluate(() => zE('webWidget', 'toggle'))
      await launcher.isVisible()
      await widget.isHidden()
      expect(await page.evaluate(() => zE('webWidget:get', 'display'))).toEqual('launcher')
    })

    test('initially open', async () => {
      await launcher.click()
      await page.evaluate(() => zE('webWidget', 'toggle'))
      await launcher.isVisible()
      await widget.isHidden()
    })
  })
})
