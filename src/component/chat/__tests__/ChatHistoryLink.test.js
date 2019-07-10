import { render } from 'react-testing-library'
import React from 'react'

import ChatHistoryLink from '../ChatHistoryLink'

const renderComponent = (props = {}) => {
  const defaultProps = {
    isAuthenticated: true,
    hasChatHistory: true,
    openedChatHistory: () => {},
    label: 'Chats here'
  }

  const combinedProps = {
    ...defaultProps,
    ...props
  }

  return render(<ChatHistoryLink {...combinedProps} />)
}

describe('rendering', () => {
  describe('when all values are true', () => {
    it('renders a link', () => {
      const { queryByText } = renderComponent()

      expect(queryByText('Chats here')).toBeInTheDocument()
    })
  })

  describe('when is not authenticated', () => {
    it('does not render link', () => {
      const { queryByText } = renderComponent({
        isAuthenticated: false
      })

      expect(queryByText('Chats here')).not.toBeInTheDocument()
    })
  })

  describe('when there is no chat history', () => {
    it('does not render link', () => {
      const { queryByText } = renderComponent({
        hasChatHistory: false
      })

      expect(queryByText('Chats here')).not.toBeInTheDocument()
    })
  })
})
