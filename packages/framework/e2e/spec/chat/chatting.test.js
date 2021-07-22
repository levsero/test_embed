import {
  loadWidgetWithChatOnline,
  clickStartChat,
  agentJoinsChat,
  sendMessageFromUser,
  sendMessageFromAgent,
  waitForChatToBeReady,
} from 'e2e/helpers/chat-embed'
import frame from 'e2e/helpers/frame'
import widget from 'e2e/helpers/widget'

const getFrame = () => frame.getByName('webWidget')

beforeEach(async () => {
  await loadWidgetWithChatOnline()
  await clickStartChat()
  await waitForChatToBeReady()
})

test('basic message sending', async () => {
  await widget.expectToSeeText('Chat with us')
  await widget.expectToSeeText('Live Support')

  await agentJoinsChat('An agent')
  await widget.expectToSeeText('An agent joined the chat')

  await sendMessageFromAgent('An agent', 'message from agent')
  await widget.expectToSeeText('message from agent')

  await sendMessageFromUser('message from user')
  await widget.expectToSeeText('message from user')
})

test('long message from agent scrolls down the page', async () => {
  const longMessage =
    'AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEE' +
    'AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEE' +
    'AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEE' +
    'AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEE' +
    'AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEE' +
    'AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEE' +
    'AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEE' +
    'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ'
  await widget.expectToSeeText('Chat with us')

  await agentJoinsChat('An agent')

  await sendMessageFromUser('message from user')
  await widget.expectToSeeText('message from user')

  await sendMessageFromAgent('An agent', longMessage)
  await widget.expectToSeeText(longMessage)

  const frame = await getFrame()
  const userMessage = await frame.waitForSelector(`[data-testid="chat-msg-user"]`)
  expect(userMessage).toBeTruthy()
  expect(await userMessage.isIntersectingViewport()).toBeFalsy()
})
