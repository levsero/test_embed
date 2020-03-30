import { queries } from 'pptr-testing-library'

import widget from 'e2e/helpers/widget'

import zChat from 'e2e/helpers/zChat'
import {
  sendMessageFromUser,
  agentJoinsChat,
  sendMessageFromAgent,
  loadWidgetWithChatOnline,
  clickStartChat,
  clickEndChat,
  clickToConfirmEndChat
} from 'e2e/helpers/chat-embed'

const agentRequestsRating = async () => {
  const detail = {
    nick: 'agent:12345',
    display_name: 'Cordy the agent',
    proactive: false
  }

  await zChat.agentRequestRating(detail)

  expect(await queries.queryByLabelText(await widget.getDocument(), 'Rate this chat')).toBeTruthy()
}

const userClicksRatingButton = async rating => {
  const ratingButton = await queries.queryByLabelText(
    await widget.getDocument(),
    `Rate this chat as ${rating}`
  )
  await ratingButton.click()
}

const userClicksCommentButton = async () => {
  const commentButton = await queries.queryByLabelText(
    await widget.getDocument(),
    'Leave a comment'
  )
  await commentButton.click()
}

const setup = async () => {
  await loadWidgetWithChatOnline()
  await clickStartChat()

  await sendMessageFromUser('this is a message from the end user')
  await agentJoinsChat('Very good agent')
  await sendMessageFromAgent('Very good Agent', 'this is a message from the agent')
}

describe('chat ratings', () => {
  test('end user can rate a chat with chat rating buttons', async () => {
    await setup()

    await userClicksRatingButton('bad')
    await zChat.rating('bad')

    expect(await queries.queryByText(await widget.getDocument(), 'Chat rated Bad')).toBeTruthy()
    expect(await queries.queryByText(await widget.getDocument(), 'Leave a comment')).toBeTruthy()

    await userClicksCommentButton()
    const cancelButton = await queries.queryByLabelText(await widget.getDocument(), 'Cancel')
    await cancelButton.click()

    expect(await queries.queryByText(await widget.getDocument(), 'Chat rated Bad')).toBeTruthy()
    expect(await queries.queryByText(await widget.getDocument(), 'Leave a comment')).toBeTruthy()
  })

  test('end user can rate a chat via the rating page', async () => {
    await setup()

    await agentRequestsRating()
    const rateChatButton = await queries.queryByLabelText(
      await widget.getDocument(),
      'Rate this chat'
    )
    await rateChatButton.click()
    await userClicksRatingButton('bad')
    await zChat.rating('bad')
    const sendButton = await queries.queryByLabelText(await widget.getDocument(), 'Send')
    await sendButton.click()

    expect(await queries.queryByText(await widget.getDocument(), 'Chat rated Bad')).toBeTruthy()
  })

  test('end user can rate a chat via the post chat page', async () => {
    await setup()
    await clickEndChat()
    await clickToConfirmEndChat()

    await userClicksRatingButton('good')
    const sendButton = await queries.queryByLabelText(await widget.getDocument(), 'Send')
    await sendButton.click()
    await zChat.rating('good')

    expect(await queries.queryByText(await widget.getDocument(), 'Chat rated Good')).toBeTruthy()
  })
})
