import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
})

test.skip('setOnStatus executes a callback when the status changes to online', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setOnStatus(status => (window.zopimStatus = status))
  })

  await zChat.online()
  const result = await page.evaluate(() => window.zopimStatus)

  expect(await result).toEqual('online')
})

test.skip('setOnStatus executes a callback when the status changes to offline', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setOnStatus(status => (window.zopimStatus = status))
  })

  await zChat.offline()
  const result = await page.evaluate(() => window.zopimStatus)

  expect(await result).toEqual('offline')
})
