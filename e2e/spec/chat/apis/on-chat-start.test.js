import { agentJoinsChat, getChatReadyAndEvaluate } from 'e2e/helpers/chat-embed'

test('on chat:start shows a chat has, well, started', async () => {
  await getChatReadyAndEvaluate(() => {
    zE('webWidget:on', 'chat:start', () => {
      window.onChatStartCalled = true
    })
  })

  await agentJoinsChat('Cody Allen')
  const result = await page.evaluate(() => window.onChatStartCalled)

  expect(result).toEqual(true)
})
