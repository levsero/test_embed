import {
  sendMessageFromUser,
  agentJoinsChat,
  sendMessageFromAgent,
  clickEndChat,
  clickToConfirmEndChat,
  openChattingScreen,
} from 'e2e/helpers/chat-embed'
import widget from 'e2e/helpers/widget'
import zChat from 'e2e/helpers/zChat'
import { queries } from 'pptr-testing-library'

const agentRequestsRating = async () => {
  const detail = {
    nick: 'agent:12345',
    display_name: 'Cordy the agent',
    proactive: false,
  }

  await zChat.agentRequestRating(detail)

  expect(await queries.queryByLabelText(await widget.getDocument(), 'Rate this chat')).toBeTruthy()
}

const userClicksRatingButton = async (rating) => {
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
  await openChattingScreen()

  await sendMessageFromUser('this is a message from the end user')
  await agentJoinsChat('Very good agent')
  await sendMessageFromAgent('Very good Agent', 'this is a message from the agent')
}

describe('chat ratings', () => {
  test('rating buttons only show when an agent has joined the chat', async () => {
    await openChattingScreen()

    await sendMessageFromUser('this is a message from the end user')

    expect(
      await queries.queryByLabelText(await widget.getDocument(), 'Rate this chat as good')
    ).toBeFalsy()
    expect(
      await queries.queryByLabelText(await widget.getDocument(), 'Rate this chat as bad')
    ).toBeFalsy()

    await agentJoinsChat('Very good agent')

    expect(
      await queries.queryByLabelText(await widget.getDocument(), 'Rate this chat as good')
    ).toBeTruthy()
    expect(
      await queries.queryByLabelText(await widget.getDocument(), 'Rate this chat as bad')
    ).toBeTruthy()
  })

  test('end user can rate a chat with chat rating buttons', async () => {
    await setup()
    await userClicksRatingButton('bad')
    await zChat.rating('bad')

    await widget.expectToSeeText('Chat rated Bad')
    await widget.expectToSeeText('Leave a comment')

    await userClicksCommentButton()
    const cancelButton = await queries.queryByLabelText(await widget.getDocument(), 'Cancel')
    await cancelButton.click()

    await widget.expectToSeeText('Chat rated Bad')
    await widget.expectToSeeText('Leave a comment')
  })

  test('end user can remove rating', async () => {
    await setup()

    await userClicksRatingButton('bad')
    await zChat.rating('bad')

    expect(await queries.queryByText(await widget.getDocument(), 'Chat rated Bad')).toBeTruthy()

    await userClicksRatingButton('bad')
    await zChat.rating(undefined, 'bad')

    expect(
      await queries.queryByText(await widget.getDocument(), 'Chat rating removed')
    ).toBeTruthy()
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
    await widget.expectToSeeText('Chat rated Bad')
  })

  test('end user can rate a chat via the post chat page', async () => {
    await setup()
    await clickEndChat()
    await clickToConfirmEndChat()

    await userClicksRatingButton('good')
    const sendButton = await queries.queryByLabelText(await widget.getDocument(), 'Send')
    await sendButton.click()
    await zChat.rating('good')
    await widget.expectToSeeText('Chat rated Good')
  })
})
