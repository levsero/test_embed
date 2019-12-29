import loadWidget from 'e2e/helpers/widget-page/fluent'
import launcher from 'e2e/helpers/launcher'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
  await zChat.online()
})

test('api returns false when launcher is visible', async () => {
  expect(await page.evaluate(() => $zopim.livechat.window.getDisplay())).toEqual(false)
})

test('api returns true when widget is open', async () => {
  await launcher.click()
  expect(await page.evaluate(() => $zopim.livechat.window.getDisplay())).toEqual(true)
})
