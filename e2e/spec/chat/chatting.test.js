import widget from 'e2e/helpers/widget'

import {
  loadWidgetWithChatOnline,
  clickStartChat,
  agentJoinsChat,
  sendMessageFromUser,
  sendMessageFromAgent,
  waitForChatToBeReady
} from 'e2e/helpers/chat-embed'

test('basic message sending', async () => {
  await loadWidgetWithChatOnline()
  await clickStartChat()
  await waitForChatToBeReady()

  await widget.expectToSeeText('Chat with us')
  await widget.expectToSeeText('Live Support')

  await agentJoinsChat('An agent')
  await widget.expectToSeeText('An agent joined the chat')

  await sendMessageFromAgent('An agent', 'message from agent')
  await widget.expectToSeeText('message from agent')

  await sendMessageFromUser('message from user')
  await widget.expectToSeeText('message from user')
})
