import { queries } from 'pptr-testing-library'

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

  expect(await queries.queryByText(await widget.getDocument(), 'Chat with us')).toBeTruthy()
  expect(await queries.queryByText(await widget.getDocument(), 'Live Support')).toBeTruthy()

  await agentJoinsChat('An agent')
  expect(
    await queries.queryByText(await widget.getDocument(), 'An agent joined the chat')
  ).toBeTruthy()

  await sendMessageFromAgent('An agent', 'message from agent')
  expect(await queries.queryByText(await widget.getDocument(), 'message from agent')).toBeTruthy()

  await sendMessageFromUser('message from user')
  expect(await queries.queryByText(await widget.getDocument(), 'message from user')).toBeTruthy()
})
