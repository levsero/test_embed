import { CHATTING_SCREEN } from 'classicSrc/redux/modules/chat/chat-screen-types'
import { render } from 'classicSrc/util/testHelpers'
import { Component as AgentDetailsPage } from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    updateChatScreen: jest.fn(),
  }

  return render(<AgentDetailsPage {...defaultProps} {...props} />)
}

test('renders the agent screen title', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Chat with us')).toBeInTheDocument()
})

test('navigates to the chatting screen when back button is clicked', () => {
  const updateChatScreen = jest.fn()

  const { queryByText } = renderComponent({ updateChatScreen })

  queryByText('Back to chat').click()

  expect(updateChatScreen).toHaveBeenCalledWith(CHATTING_SCREEN)
})
