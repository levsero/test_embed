import loadWidget from 'e2e/helpers/widget-page/fluent'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
  await zChat.online()
})

test('toggles the widget from hidden to visible', async () => {
  await page.evaluate(() => $zopim.livechat.window.toggle())

  await expect(launcher).toBeHidden()
  await expect(widget).toBeVisible()
  await page.evaluate(() => $zopim.livechat.window.toggle())
  await expect(launcher).toBeVisible()
  await expect(widget).toBeHidden()
})
