import { openChattingScreenAndEvaluate } from 'e2e/helpers/chat-embed'
import zChat from 'e2e/helpers/zChat'

test('on chat:status calls a function when the status changes', async () => {
  let result

  await openChattingScreenAndEvaluate(() => {
    zE('webWidget:on', 'chat:status', (status) => {
      window.chatStatus = status
    })
  })

  await zChat.online()
  result = await page.evaluate(() => window.chatStatus)

  expect(result).toEqual('online')

  await zChat.offline()
  result = await page.evaluate(() => window.chatStatus)

  expect(result).toEqual('offline')
  await expect(page).toPassAxeTests({
    exclude: ['#launcher'],
  })
})
