import { agentJoinsChat, openChattingScreen } from 'e2e/helpers/chat-embed'

test('chat:isChatting shows a chat has not started', async () => {
  await openChattingScreen()

  const isChatting = await page.evaluate(() => $zopim.livechat.isChatting())

  expect(isChatting).toBeFalsy()
})

test('chat:isChatting shows a chat is in progress', async () => {
  await openChattingScreen()
  await agentJoinsChat('Cody Allen')

  const isChatting = await page.evaluate(() => $zopim.livechat.isChatting())

  expect(isChatting).toBeTruthy()
})
