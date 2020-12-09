import React from 'react'
import { find } from 'styled-components/test-utils'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { Component as ViewHistoryButton } from 'embeds/chat/components/ViewHistoryButton'
import { Container, HistoryIcon } from 'embeds/chat/components/ViewHistoryButton/styles'

describe('ViewHistoryButton', () => {
  const defaultProps = {
    canShowHistory: true,
    onOpenChatHistory: jest.fn()
  }

  const renderComponent = (props = {}) => render(<ViewHistoryButton {...defaultProps} {...props} />)

  it('renders nothing if there is no history to show', () => {
    const { container } = renderComponent({ canShowHistory: false })

    expect(find(container, Container)).not.toBeInTheDocument()
  })

  describe('when can show chat history', () => {
    it('renders a icon to signify chat history', () => {
      const { container } = renderComponent({ canShowHistory: true })

      expect(find(container, HistoryIcon)).toBeInTheDocument()
    })

    it('calls onOpenChatHistory when clicked', () => {
      const onOpenChatHistory = jest.fn()

      const { queryByText } = renderComponent({ canShowHistory: true, onOpenChatHistory })

      fireEvent.click(queryByText('View past chats'))

      expect(onOpenChatHistory).toHaveBeenCalled()
    })
  })
})