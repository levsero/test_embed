import React from 'react'
import userEvent from '@testing-library/user-event'
import * as suncoClient from 'src/apps/messenger/api/sunco'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Footer from '../'
import { startTyping, cancelTyping } from '../typing'

jest.mock('src/apps/messenger/api/sunco')
jest.mock('../typing')

describe('Footer', () => {
  const defaultProps = { isComposerEnabled: true }

  const renderComponent = (props = {}, options) => {
    return render(<Footer {...defaultProps} {...props} />, options)
  }

  it('submits when the user hits enter', () => {
    const { getByLabelText, queryByText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, 'message from user')

    expect(queryByText('message from user')).toBeInTheDocument()
    userEvent.type(input, '{enter}')

    expect(suncoClient.sendMessage).toHaveBeenCalledWith('message from user', undefined)
    expect(queryByText('message from user')).not.toBeInTheDocument()
  })

  it('submits when the user clicks the Send button', () => {
    const { getByLabelText, queryByText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, 'message from user')

    expect(queryByText('message from user')).toBeInTheDocument()

    userEvent.click(getByLabelText('Send message'))

    expect(suncoClient.sendMessage).toHaveBeenCalledWith('message from user', undefined)
    expect(queryByText('message from user')).not.toBeInTheDocument()
  })

  it('calls startTyping on every key change', () => {
    const { getByLabelText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, 'message from user')

    expect(startTyping).toHaveBeenCalled()

    startTyping.mockReset()

    userEvent.type(input, '{backspace}')

    expect(startTyping).toHaveBeenCalled()
  })

  it('calls cancelTyping when the user sends a message, since stop typing is implied when a message is sent', () => {
    const { getByLabelText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, 'message from user')

    expect(startTyping).toHaveBeenCalled()
    expect(cancelTyping).not.toHaveBeenCalled()

    userEvent.type(input, '{enter}')

    expect(cancelTyping).toHaveBeenCalled()
  })

  it('persists the text when you close and re-open the widget', () => {
    const first = renderComponent()

    userEvent.type(first.getByLabelText('Type a message'), 'message from user')

    expect(first.getByLabelText('Type a message')).toHaveValue('message from user')

    first.unmount()

    const second = renderComponent(undefined, { store: first.store })

    expect(second.getByLabelText('Type a message')).toHaveValue('message from user')
  })
})
