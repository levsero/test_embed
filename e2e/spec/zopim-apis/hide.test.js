import widgetPage from 'helpers/widget-page'
import launcher from 'helpers/launcher'
import widget from 'helpers/widget'

beforeEach(async () => {
  await widgetPage.loadWithConfig('helpCenter', 'zopimChat')
})

test('$zopim.livechat.window.hide()', async () => {
  await page.evaluate(() => $zopim.livechat.window.hide())
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})

test('$zopim.livechat.button.hide()', async () => {
  await page.evaluate(() => $zopim.livechat.button.hide())
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})

test('$zopim.livechat.hideAll()', async () => {
  await page.evaluate(() => $zopim.livechat.hideAll())
  await expect(launcher).toBeHidden()
  await expect(widget).toBeHidden()
})
