import { render } from 'utility/testHelpers'
import { Component as ChatRatingPage } from '../'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'

const renderComponent = (props = {}) => {
  const defaultProps = {
    rating: {},
    sendChatRating: jest.fn(),
    sendChatComment: jest.fn(),
    updateChatScreen: jest.fn(),
    concierges: [
      {
        displayName: 'Agent',
        title: 'person who does things',
      },
    ],
  }

  return render(<ChatRatingPage {...defaultProps} {...props} />)
}

test('renders the send button in the feedback form', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Send')).toBeInTheDocument()
})

test('renders the cancel button in the feedback form', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Cancel')).toBeInTheDocument()
})

test('navigates to the chatting screen when the Cancel button is clicked', () => {
  const updateChatScreen = jest.fn()
  const rating = { comment: 'A comment' }

  const { queryByText } = renderComponent({ updateChatScreen, rating })

  queryByText('Cancel').click()

  expect(updateChatScreen).toHaveBeenCalledWith(CHATTING_SCREEN)
})
