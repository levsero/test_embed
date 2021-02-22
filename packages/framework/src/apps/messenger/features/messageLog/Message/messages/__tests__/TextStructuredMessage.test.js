import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/dom'
import { MESSAGE_STATUS } from '@zendesk/conversation-components'
import { render } from 'src/apps/messenger/utils/testHelpers'
import TextStructuredMessage from 'src/apps/messenger/features/messageLog/Message/messages/TextStructuredMessage'
import { sendMessage } from 'src/apps/messenger/api/sunco'

jest.mock('src/apps/messenger/api/sunco')

describe('TextStructuredMessage', () => {
  const defaultProps = {
    message: {
      _id: '123',
      role: 'appUser',
    },
  }

  const quickReplies = [
    {
      type: 'reply',
      _id: '1',
      payload: 'one-payload',
      text: 'one-text',
      metadata: {
        one: 'metadata',
      },
    },
    {
      type: 'reply',
      _id: '2',
      payload: 'two-payload',
      text: 'two-text',
      metadata: {
        two: 'metadata',
      },
    },
  ]

  const renderComponent = (props = {}) =>
    render(<TextStructuredMessage {...defaultProps} {...props} />)

  it('renders', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('renders quick replies when it is the last in the log', () => {
    const { getByText } = renderComponent({
      message: {
        ...defaultProps.message,
        isLastInLog: true,
        actions: quickReplies,
      },
    })

    expect(getByText('one-text')).toBeInTheDocument()
    expect(getByText('two-text')).toBeInTheDocument()
  })

  it('does not render quick replies when it is not the last in the log', () => {
    const { queryByText } = renderComponent({
      message: {
        ...defaultProps.message,
        isLastInLog: false,
        actions: quickReplies,
      },
    })

    expect(queryByText('one-text')).not.toBeInTheDocument()
    expect(queryByText('two-text')).not.toBeInTheDocument()
  })

  it('sends the quick reply as a message when clicked', () => {
    const { getByText } = renderComponent({
      message: {
        ...defaultProps.message,
        isLastInLog: true,
        actions: quickReplies,
      },
    })

    userEvent.click(getByText('one-text'))

    expect(sendMessage).toHaveBeenCalledWith('one-text', 'one-payload', { one: 'metadata' })
  })

  it('resends the message when the user retries sending the message', async () => {
    const { getByText } = renderComponent({
      message: {
        ...defaultProps.message,

        status: MESSAGE_STATUS.failed,
        text: 'one-text',
        payload: 'one-payload',
        metadata: {
          one: 'metadata',
        },
      },
    })

    await waitFor(() => expect(getByText('Tap to retry')).toBeInTheDocument())

    userEvent.click(getByText('Tap to retry'))

    expect(sendMessage).toHaveBeenCalledWith('one-text', 'one-payload', { one: 'metadata' })
  })
})
