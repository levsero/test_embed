import { agentJoinsChat, getChatReadyAndEvaluate } from 'e2e/helpers/chat-embed'

test('on chat:connected shows a chat connection has been successful', async () => {
  await getChatReadyAndEvaluate(() => {
    zE('webWidget:on', 'chat:connected', () => {
      window.onChatConnectedCalled = true
    })
  })

  await agentJoinsChat('Cody Allen')
  const result = await page.evaluate(() => window.onChatConnectedCalled)

  expect(result).toEqual(true)
})
