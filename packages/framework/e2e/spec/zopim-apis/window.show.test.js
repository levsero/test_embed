import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
  await zChat.online()
})

test('api opens the widget', async () => {
  await page.evaluate(() => $zopim.livechat.window.show())

  await widget.waitForWidget({ isVisible: true })
  await expect(launcher).toBeHidden()
})

test('api shows the widget in opened state when the whole widget is initially hidden', async () => {
  await page.evaluate(() => $zopim.livechat.window.hide())
  await page.evaluate(() => $zopim.livechat.window.show())
  await widget.waitForWidget({ isVisible: true })
  await expect(launcher).toBeHidden()
})
