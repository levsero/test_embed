import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { MESSAGE_STATUS } from '@zendesk/conversation-components'
import * as messageLogStore from 'src/apps/messenger/features/messageLog/store'
import { render } from 'src/apps/messenger/utils/testHelpers'
import FileStructuredMessage from '../FileStructuredMessage'

jest.mock('src/apps/messenger/api/sunco', () => ({
  sendFile: jest.fn(),
}))

describe('FileStructuredMessage', () => {
  const defaultProps = {
    message: {
      _id: 'EYUdIY9FEbM0loAa',
      avatarUrl: 'emu.jpg',
      isFirstInGroup: true,
      isFirstMessageInAuthorGroup: true,
      isLastInGroup: true,
      isLastMessageInAuthorGroup: true,
      role: 'appUser',
      mediaSize: 1000,
      mediaUrl:
        'https://z3ntpatullock.zendesk.com/attachments/token/abc123/?name=Ship-Information.pdf',
      name: 'The Dungeon Master',
      received: 123456,
    },
  }

  const renderComponent = (props = { message: {} }) => {
    const expectedProps = {
      message: {
        ...defaultProps.message,
        ...props.message,
      },
    }

    return render(<FileStructuredMessage {...expectedProps} />)
  }

  it('displays the file name', () => {
    renderComponent({
      message: {
        mediaUrl: 'https://support.zendesk.com/attachments/token/abc123/some%20file.pdf',
        status: MESSAGE_STATUS.sent,
      },
    })

    expect(screen.getByText('some file.pdf')).toBeInTheDocument()
  })

  describe('when status is pending', () => {
    it('uses the alt text for the file name', () => {
      renderComponent({
        message: {
          mediaUrl: 'https://support.zendesk.com/attachments/token/abc123/some%20file.pdf',
          altText: 'some%20file.pdf',
          isOptimistic: true,
        },
      })

      expect(screen.getByText('some file.pdf')).toBeInTheDocument()
    })

    it('shows sending status in receipt', () => {
      const { getByText } = renderComponent({
        message: {
          ...defaultProps.message,
          status: 'sending',
          isLastMessageThatHasntFailed: true,
        },
      })
      expect(getByText('Sending')).toBeInTheDocument()
    })
  })

  describe('when status is failed', () => {
    it('allows the user to retry sending the file when reason is "unknown"', () => {
      const { getByText } = renderComponent({
        message: {
          ...defaultProps.message,
          status: 'failed',
          errorReason: 'unknown',
          isRetryable: true,
        },
      })

      jest.spyOn(messageLogStore, 'sendFile')

      userEvent.click(getByText('Tap to retry'))

      expect(messageLogStore.sendFile).toHaveBeenCalledWith({ messageId: 'EYUdIY9FEbM0loAa' })
    })

    it('allows the user to retry sending the file when reason is "tooMany"', () => {
      const { getByText } = renderComponent({
        message: {
          ...defaultProps.message,
          status: 'failed',
          errorReason: 'tooMany',
          isRetryable: true,
        },
      })

      jest.spyOn(messageLogStore, 'sendFile')

      userEvent.click(getByText('Limit of 25 files per upload. Tap to retry.'))

      expect(messageLogStore.sendFile).toHaveBeenCalledWith({ messageId: 'EYUdIY9FEbM0loAa' })
    })

    it('does not allow retries when reason is "fileSize"', () => {
      const { getByText } = renderComponent({
        message: {
          ...defaultProps.message,
          status: 'failed',
          errorReason: 'fileSize',
          isRetryable: false,
        },
      })

      jest.spyOn(messageLogStore, 'sendFile')

      userEvent.click(getByText('Files must be 50 MB or less'))

      expect(messageLogStore.sendFile).not.toBeCalled()
    })
  })
})
