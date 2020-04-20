import {
  agentJoinsChat,
  getChatReadyAndEvaluate,
  sendMessageFromAgent
} from 'e2e/helpers/chat-embed'

test('on chat:unreadMessages returns the number of unread messages', async () => {
  let result

  await getChatReadyAndEvaluate(() => {
    zE('webWidget:on', 'chat:unreadMessages', number => {
      window.unreadMessageNumber = number
    })
  })

  await agentJoinsChat('Cody Allen')

  await sendMessageFromAgent('Cody Allen', "It's the Riptide!")
  result = await page.evaluate(() => window.unreadMessageNumber)
  expect(result).toEqual(1)
})
