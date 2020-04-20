import { agentJoinsChat, getChatReady } from 'e2e/helpers/chat-embed'

test('chat:isChatting shows a chat has not started', async () => {
  await getChatReady()

  const isChatting = await page.evaluate(() => zE('webWidget:get', 'chat:isChatting'))

  expect(isChatting).toBeFalsy()
})

test('chat:isChatting shows a chat is in progress', async () => {
  await getChatReady()
  await agentJoinsChat('Cody Allen')

  const isChatting = await page.evaluate(() => zE('webWidget:get', 'chat:isChatting'))

  expect(isChatting).toBeTruthy()
})
