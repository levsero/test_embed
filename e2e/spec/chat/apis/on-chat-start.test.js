import { agentJoinsChat, openChattingScreenAndEvaluate } from 'e2e/helpers/chat-embed'

test('on chat:start executes a callback when a chat has, well, started', async () => {
  await openChattingScreenAndEvaluate(() => {
    zE('webWidget:on', 'chat:start', () => {
      window.onChatStartCalled = true
    })
  })

  await agentJoinsChat('Cody Allen')
  const result = await page.evaluate(() => window.onChatStartCalled)

  expect(result).toEqual(true)
})
