import React from 'react'
import userEvent from '@testing-library/user-event'
import * as suncoClient from 'src/apps/messenger/suncoClient'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Footer from '../'

jest.mock('src/apps/messenger/suncoClient')

describe('Footer', () => {
  const defaultProps = { isComposerEnabled: true }

  const renderComponent = (props = {}) => {
    return render(<Footer {...defaultProps} {...props} />)
  }

  it('submits when the user hits enter', () => {
    const mockClient = { sendMessage: jest.fn() }
    jest.spyOn(suncoClient, 'getClient').mockReturnValue(mockClient)
    const { getByLabelText, queryByText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, 'message from user')

    expect(queryByText('message from user')).toBeInTheDocument()
    userEvent.type(input, '{enter}')

    expect(mockClient.sendMessage).toHaveBeenCalledWith('message from user', undefined)
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

    expect(mockClient.sendMessage).toHaveBeenCalledWith('message from user', undefined)
    expect(queryByText('message from user')).not.toBeInTheDocument()
  })
})
