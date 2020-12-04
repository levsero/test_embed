import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'
import { agentJoinsChat } from 'e2e/helpers/chat-embed'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
})

test('setOnConnected executes a callback when a chat starts', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setOnChatStart(() => (window.setOnChatStart = true))
  })

  await zChat.online()
  await agentJoinsChat('Cody Allen')
  const result = await page.evaluate(() => window.setOnChatStart)

  expect(result).toEqual(true)
})
