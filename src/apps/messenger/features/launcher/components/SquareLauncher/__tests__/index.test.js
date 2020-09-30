import React from 'react'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/dom'
import { render } from 'src/apps/messenger/utils/testHelpers'
import { find } from 'styled-components/test-utils'
import { MessengerIcon, CloseIcon } from '../styles'

import SquareLauncher from '../'
import { messageReceived, messagesReceived } from 'src/apps/messenger/features/messageLog/store'
import { widgetClosed } from 'src/apps/messenger/store/visibility'
import { markAsRead } from 'src/apps/messenger/store/unreadIndicator'

const renderComponent = (props = {}) => {
  return render(<SquareLauncher {...props} />)
}

describe('SquareLauncher', () => {
  it('initally renders the Open icon', () => {
    const { container } = renderComponent()

    expect(find(container, MessengerIcon)).toBeInTheDocument()
  })

  it('renders the close icon when the widget is open', () => {
    const { container } = renderComponent()

    userEvent.click(find(container, MessengerIcon))

    expect(find(container, CloseIcon)).toBeInTheDocument()
  })

  it('renders a box shadow on hover', () => {
    renderComponent()

    userEvent.hover(screen.getByRole('button'))

    expect(screen.getByRole('button')).toHaveStyleRule(`
    background-color: #17494D !important;
    color: #17494D !important;
    box-shadow: -4px 0px 20px 0px rgba(36,36,36,0.2);`)
  })

  it('displays an unread indicator when there are unread messages', () => {
    const { queryByText, store } = renderComponent()

    const mockMessages = [...new Array(37)].map((_, index) => ({
      _id: index,
      type: 'text',
      text: `Message ${index}`,
      received: 1 + index
    }))

    store.dispatch(
      messagesReceived({
        messages: mockMessages
      })
    )

    expect(queryByText('37')).toBeInTheDocument()

    store.dispatch(markAsRead({ lastMessageTimestamp: 38 }))

    expect(queryByText('37')).not.toBeInTheDocument()
  })

  it('displays 99+ in the unread indicator when there are more than 99 messages', () => {
    const { getByText, store } = renderComponent()

    store.dispatch(widgetClosed())

    const mockMessages = [...new Array(99)].map((_, index) => ({
      _id: index,
      type: 'text',
      text: `Message ${index}`,
      received: 1 + index
    }))

    store.dispatch(
      messagesReceived({
        messages: mockMessages
      })
    )

    expect(getByText('99')).toBeInTheDocument()

    store.dispatch(
      messageReceived({
        message: {
          _id: 100,
          type: 'text',
          text: 'Message 100',
          received: 100
        }
      })
    )

    expect(screen.getByText('+')).toBeInTheDocument()
  })
})
