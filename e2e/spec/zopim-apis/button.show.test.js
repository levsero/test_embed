import loadWidget from 'e2e/helpers/widget-page/fluent'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
  await zChat.online()
})

test('api shows the launcher after it is hidden', async () => {
  await page.evaluate(() => $zopim.livechat.button.hide())
  await page.evaluate(() => $zopim.livechat.button.show())
  await expect(widget).toBeHidden()
  await expect(launcher).toBeVisible()
})
