import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'
import { wait } from 'pptr-testing-library'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
})

test('setOnStatus executes a callback when the status changes to online', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setOnStatus((status) => (window.zopimStatus = status))
  })

  await zChat.online()

  await wait(async () => {
    expect(await page.evaluate(() => window.zopimStatus)).toEqual('online')
  })
})

test('setOnStatus executes a callback when the status changes to offline', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setOnStatus((status) => (window.zopimStatus = status))
  })

  await zChat.offline()

  await wait(async () => {
    expect(await page.evaluate(() => window.zopimStatus)).toEqual('offline')
  })
})
