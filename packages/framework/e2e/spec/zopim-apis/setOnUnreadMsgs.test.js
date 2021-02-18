import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'
import { agentJoinsChat, sendMessageFromAgent } from 'e2e/helpers/chat-embed'

beforeEach(async () => {
  await loadWidget('helpCenter', 'chat')
  await zChat.online()
})

test('setOnUnreadMsgs executes a callback with the number of unread messages', async () => {
  await page.evaluate(() => {
    $zopim.livechat.setOnUnreadMsgs((number) => (window.unreadMessageNumber = number))
  })

  await agentJoinsChat('Cody Allen')

  await sendMessageFromAgent('Cody Allen', "It's the Riptide!")

  const result = await page.evaluate(() => window.unreadMessageNumber)

  expect(result).toEqual(1)
})
