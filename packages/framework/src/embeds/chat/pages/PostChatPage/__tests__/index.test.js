import React from 'react'
import { render } from 'utility/testHelpers'
import { Component as PostChatPage } from '../'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'

const renderComponent = (props = {}) => {
  const defaultProps = {
    rating: {},
    sendChatRating: jest.fn(),
    sendChatComment: jest.fn(),
    updateChatScreen: jest.fn(),
    endChat: jest.fn(),
    concierges: [
      {
        displayName: 'Agent',
        title: 'person who does things'
      }
    ]
  }

  return render(<PostChatPage {...defaultProps} {...props} />)
}

test('renders the Send button in the feedback form', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Send')).toBeInTheDocument()
})

test('renders the Skip button in the feedback form', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Skip')).toBeInTheDocument()
})

test('navigates to the chatting screen when the Skip button is clicked', () => {
  const updateChatScreen = jest.fn()

  const { queryByText } = renderComponent({ updateChatScreen })

  queryByText('Skip').click()

  expect(updateChatScreen).toHaveBeenCalledWith(CHATTING_SCREEN)
})

test('ends the chat when the Skip button is clicked', () => {
  const endChat = jest.fn()

  const { queryByText } = renderComponent({ endChat })

  queryByText('Skip').click()

  expect(endChat).toHaveBeenCalled()
})

test('ends the chat when the Send button is clicked', () => {
  const endChat = jest.fn()
  const rating = { comment: 'A comment' }

  const { queryByText } = renderComponent({ endChat, rating })

  queryByText('Send').click()

  expect(endChat).toHaveBeenCalled()
})
