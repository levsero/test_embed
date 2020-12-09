import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
})

test('setOnConnected executes a callback on a successful connection', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setOnConnected(() => (window.setOnConnectedCalled = true))
  })

  await zChat.online()
  const result = await page.evaluate(() => window.setOnConnectedCalled)

  expect(result).toEqual(true)
})
