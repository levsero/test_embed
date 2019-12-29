import loadWidget from 'e2e/helpers/widget-page/fluent'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
  await zChat.online()
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
