import { agentJoinsChat, openChattingScreenAndEvaluate } from 'e2e/helpers/chat-embed'

test('on chat:connected executes a callback on a successful connection', async () => {
  await openChattingScreenAndEvaluate(() => {
    zE('webWidget:on', 'chat:connected', () => {
      window.onChatConnectedCalled = true
    })
  })

  await agentJoinsChat('Cody Allen')
  const result = await page.evaluate(() => window.onChatConnectedCalled)

  expect(result).toEqual(true)
})
