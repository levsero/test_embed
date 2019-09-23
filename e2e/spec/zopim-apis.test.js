import { queries } from 'pptr-testing-library'
import WidgetHelper from '../helpers/widgetHelper'
import { loadPageWithWidget } from '../helpers/utils'

beforeEach(async () => await loadPageWithWidget())

test('$zopim.livechat.window.getDisplay()', async () => {
  expect(await page.evaluate(() => $zopim.livechat.window.getDisplay())).toEqual(false)
  const widgetHelper = new WidgetHelper(page)
  await widgetHelper.clickLauncherPill()
  expect(await page.evaluate(() => $zopim.livechat.window.getDisplay())).toEqual(true)
})

test('$zopim.livechat.window.toggle()', async () => {
  await page.evaluate(() => $zopim.livechat.window.toggle())
  await page.waitForSelector('iframe#launcher', {
    visible: false
  })
  await page.waitForSelector('iframe#webWidget', {
    visible: true
  })
  await page.evaluate(() => $zopim.livechat.window.toggle())
  await page.waitForSelector('iframe#launcher', {
    visible: true
  })
  await page.waitForSelector('iframe#webWidget', {
    visible: false
  })
})

test('$zopim.livechat.window.hide()', async () => {
  await page.evaluate(() => $zopim.livechat.window.hide())
  await page.waitForSelector('iframe#launcher', {
    visible: false
  })
  await page.waitForSelector('iframe#webWidget', {
    visible: false
  })
})

test('$zopim.livechat.badge.hide()', async () => {
  await page.evaluate(() => $zopim.livechat.badge.hide())
  await page.waitForSelector('iframe#launcher', {
    visible: false
  })
  await page.waitForSelector('iframe#webWidget', {
    visible: false
  })
})

test('$zopim.livechat.button.hide()', async () => {
  await page.evaluate(() => $zopim.livechat.button.hide())
  await page.waitForSelector('iframe#launcher', {
    visible: false
  })
  await page.waitForSelector('iframe#webWidget', {
    visible: false
  })
})

test('$zopim.livechat.hideAll()', async () => {
  await page.evaluate(() => $zopim.livechat.hideAll())
  await page.waitForSelector('iframe#launcher', {
    visible: false
  })
  await page.waitForSelector('iframe#webWidget', {
    visible: false
  })
})

test('$zopim.livechat.button.show()', async () => {
  await page.evaluate(() => $zopim.livechat.button.hide())
  await page.evaluate(() => $zopim.livechat.button.show())
  await page.waitForSelector('iframe#launcher', {
    visible: true
  })
  await page.waitForSelector('iframe#webWidget', {
    visible: false
  })
})

describe('$zopim.livechat.window.show()', () => {
  test('initially launcher', async () => {
    await page.evaluate(() => $zopim.livechat.window.show())
    await page.waitForSelector('iframe#launcher', {
      visible: false
    })
    await page.waitForSelector('iframe#webWidget', {
      visible: true
    })
  })

  test('initially hidden', async () => {
    await page.evaluate(() => $zopim.livechat.window.hide())
    await page.evaluate(() => $zopim.livechat.window.show())
    await page.waitForSelector('iframe#launcher', {
      visible: false
    })
    await page.waitForSelector('iframe#webWidget', {
      visible: true
    })
  })
})

test('$zopim.livechat.setLanguage(locale)', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setLanguage('fr')
  })
  const widgetHelper = new WidgetHelper(page)
  const launcher = await widgetHelper.getDocumentHandle(widgetHelper.launcherFrame)
  const element = await queries.getByTestId(launcher, 'launcher-label')
  expect(await queries.getNodeText(element)).toEqual('Aide')
})

test('$zopim.livechat.window.onShow(cb)', async () => {
  await page.evaluate(() => {
    $zopim.livechat.window.onShow(() => (window.onOpenCalled = true))
  })
  const widgetHelper = new WidgetHelper(page)
  await widgetHelper.clickLauncherPill()
  const result = await page.evaluate(() => window.onOpenCalled)
  expect(result).toEqual(true)
})

test('$zopim.livechat.window.onHide(cb)', async () => {
  await page.evaluate(() => {
    $zopim.livechat.window.onHide(() => (window.onCloseCalled = true))
  })
  const widgetHelper = new WidgetHelper(page)
  await widgetHelper.clickLauncherPill()
  await widgetHelper.clickWidgetClose()
  const result = await page.evaluate(() => window.onCloseCalled)
  expect(result).toEqual(true)
})
