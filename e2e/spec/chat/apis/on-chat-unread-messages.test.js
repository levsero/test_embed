import {
  agentJoinsChat,
  openChattingScreenAndEvaluate,
  sendMessageFromAgent
} from 'e2e/helpers/chat-embed'

test('on chat:unreadMessages returns the number of unread messages', async () => {
  await openChattingScreenAndEvaluate(() => {
    zE('webWidget:on', 'chat:unreadMessages', number => {
      window.unreadMessageNumber = number
    })
  })

  await agentJoinsChat('Cody Allen')

  await sendMessageFromAgent('Cody Allen', "It's the Riptide!")
  const result = await page.evaluate(() => window.unreadMessageNumber)
  expect(result).toEqual(1)
})
