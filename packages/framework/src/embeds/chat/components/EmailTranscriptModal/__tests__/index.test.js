import React from 'react'
import { waitFor } from '@testing-library/dom'
import { fireEvent } from '@testing-library/react'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import { render } from 'src/util/testHelpers'
import EmailTranscriptModal from 'embeds/chat/components/EmailTranscriptModal'
import * as actions from 'src/redux/modules/chat/chat-action-types'
import { sendEmailTranscript } from 'src/embeds/chat/actions/email-transcript'
import { API_CLEAR_FORM } from 'src/redux/modules/base/base-action-types'

jest.mock('src/embeds/chat/actions/email-transcript')

describe('EmailTranscriptModal', () => {
  const defaultProps = {
    onClose: jest.fn(),
  }

  const renderComponent = async (props = {}) => {
    const result = render(<EmailTranscriptModal {...defaultProps} {...props} />)

    await waitFor(() => expect(result.queryByText('Email')).toBeInTheDocument())

    return result
  }

  it("defaults to the visitor's email address if we have that information", async () => {
    const { store, queryByLabelText } = await renderComponent()

    store.dispatch({
      type: actions.SET_VISITOR_INFO_REQUEST_SUCCESS,
      payload: { email: 'example@example.com' },
    })

    await waitFor(() => expect(queryByLabelText('Email')).toHaveValue('example@example.com'))
  })

  it('does not show validation errors until the user submits the form for the first time', async () => {
    const { queryByLabelText, queryByText } = await renderComponent()

    fireEvent.change(queryByLabelText('Email'), { target: { value: 'invalid email' } })

    await waitFor(() =>
      expect(queryByText('Please enter a valid email address.')).not.toBeInTheDocument()
    )

    fireEvent.click(queryByText('Send'))

    await waitFor(() =>
      expect(queryByText('Please enter a valid email address.')).toBeInTheDocument()
    )

    fireEvent.change(queryByLabelText('Email'), { target: { value: 'example@example.com' } })

    await waitFor(() =>
      expect(queryByText('Please enter a valid email address.')).not.toBeInTheDocument()
    )
  })

  it('calls onClose when the user closes the popup', async () => {
    const onClose = jest.fn()
    const { queryByLabelText } = await renderComponent({ onClose })

    fireEvent.keyDown(queryByLabelText('Email'), { key: 'Escape', keyCode: KEY_CODES.ESCAPE })

    expect(onClose).toHaveBeenCalled()
  })

  it('displays a success message when the user successfully submits the form', async () => {
    sendEmailTranscript.mockReturnValue(() => new Promise((res) => res()))

    const { queryByLabelText, queryByText, container } = await renderComponent()

    fireEvent.change(queryByLabelText('Email'), { target: { value: 'example@example.com' } })

    fireEvent.click(queryByText('Send'))

    await waitFor(() => expect(container.querySelector('[type="success"]')).toBeInTheDocument())
  })

  it('displays an error message when the form fails to submit', async () => {
    sendEmailTranscript.mockReturnValue(() => new Promise((_, rej) => rej()))

    const { queryByLabelText, queryByText } = await renderComponent()

    fireEvent.change(queryByLabelText('Email'), { target: { value: 'example@example.com' } })

    fireEvent.click(queryByText('Send'))

    await waitFor(() => expect(queryByText('Unable to send transcript.')).toBeInTheDocument())
  })

  it('clears the form when the clear api is called', async () => {
    const { queryByLabelText, store } = await renderComponent()

    fireEvent.change(queryByLabelText('Email'), { target: { value: 'example@example.com' } })

    store.dispatch({ type: API_CLEAR_FORM, payload: { timestamp: Date.now() } })

    expect(queryByLabelText('Email')).toHaveValue('')
  })

  it('has a visual indicator to show the user that the form is submitting', async () => {
    sendEmailTranscript.mockReturnValue(() => new Promise((res) => res()))

    const { queryByLabelText, queryByText, queryByRole } = await renderComponent()

    fireEvent.change(queryByLabelText('Email'), { target: { value: 'example@example.com' } })

    fireEvent.click(queryByText('Send'))

    expect(queryByRole('progressbar')).toBeInTheDocument()
  })

  it('focuses the email input on first render', async () => {
    const { queryByLabelText } = await renderComponent()

    waitFor(() => expect(queryByLabelText('Email')).toHaveFocus())
  })
})
