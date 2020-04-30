import zChat from 'e2e/helpers/zChat'
import { openChattingScreenAndEvaluate } from 'e2e/helpers/chat-embed'

test('on chat:status calls a function when the status changes', async () => {
  let result

  await openChattingScreenAndEvaluate(() => {
    zE('webWidget:on', 'chat:status', status => {
      window.chatStatus = status
    })
  })

  await zChat.online()
  result = await page.evaluate(() => window.chatStatus)

  expect(result).toEqual('online')

  await zChat.offline()
  result = await page.evaluate(() => window.chatStatus)

  expect(result).toEqual('offline')
})
