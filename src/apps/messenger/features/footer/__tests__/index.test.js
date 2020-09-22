import React from 'react'
import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import * as suncoClient from 'src/apps/messenger/suncoClient'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Footer from '../'

jest.mock('src/apps/messenger/suncoClient')

describe('Footer', () => {
  const defaultProps = { isComposerEnabled: true }

  const renderComponent = (props = {}) => {
    return render(<Footer {...defaultProps} {...props} />)
  }

  it('renders the component with a placeholder', () => {
    const { getByLabelText } = renderComponent()

    expect(getByLabelText('Type a message')).toHaveAttribute('placeholder', 'Type a message')
  })

  it('focuses on the composer on initial render', () => {
    const { getByLabelText } = renderComponent()

    expect(getByLabelText('Type a message')).toHaveFocus()
  })

  it('shows the send icon is not present before the user starts typing', () => {
    const { queryByLabelText } = renderComponent()

    expect(queryByLabelText('Send message')).not.toBeInTheDocument()
  })

  it('shows the send icon once the user starts typing', () => {
    const { getByLabelText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, 'message from user')

    expect(getByLabelText('Send message')).toBeInTheDocument()
  })

  it('removes the send icon when the user clears their message', () => {
    const { queryByLabelText } = renderComponent()

    const input = queryByLabelText('Type a message')
    userEvent.type(input, 'message from user')
    expect(queryByLabelText('Send message')).toBeInTheDocument()

    fireEvent.change(input, { target: { value: '' } })

    expect(queryByLabelText('Send message')).not.toBeInTheDocument()
  })

  it('submits when the user hits enter', () => {
    const mockClient = { sendMessage: jest.fn() }
    jest.spyOn(suncoClient, 'getClient').mockReturnValue(mockClient)
    const { getByLabelText, queryByText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, 'message from user')

    expect(queryByText('message from user')).toBeInTheDocument()
    userEvent.type(input, '{enter}')

    expect(mockClient.sendMessage).toHaveBeenCalledWith('message from user')
    expect(queryByText('message from user')).not.toBeInTheDocument()
  })

  it('submits when the user clicks the Send button', () => {
    const mockClient = { sendMessage: jest.fn() }
    jest.spyOn(suncoClient, 'getClient').mockReturnValue(mockClient)
    const { getByLabelText, queryByText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, 'message from user')

    expect(queryByText('message from user')).toBeInTheDocument()

    userEvent.click(getByLabelText('Send message'))

    expect(mockClient.sendMessage).toHaveBeenCalledWith('message from user')
    expect(queryByText('message from user')).not.toBeInTheDocument()
  })
})
