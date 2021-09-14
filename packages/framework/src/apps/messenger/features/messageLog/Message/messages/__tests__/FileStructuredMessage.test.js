import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
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

  describe('displays file name', () => {
    describe('when given altText', () => {
      it('renders the altText', () => {
        renderComponent({ message: { altText: 'Alt.pdf' } })

        expect(screen.getByText('Alt.pdf')).toBeInTheDocument()
      })
    })

    describe('when given no altText', () => {
      it('shortens the mediaUrl into a legible filename as far as possible', () => {
        renderComponent()

        expect(screen.getByText('Ship-Information.pdf')).toBeInTheDocument()
      })

      it('shortens the given filename if it is 24 characters or longer', () => {
        renderComponent({
          message: {
            mediaUrl:
              'https://z3ntpatullock.zendesk.com/attachments/token/abc123/?name=A-Really-Long-Name-That-Should-Be-Reduced.pdf',
          },
        })

        expect(screen.getByText('A-Really-Lo...-Reduced.pdf')).toBeInTheDocument()
      })
    })
  })

  describe('when status is pending', () => {
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
    it('allows file sending retries when reason is "unknown"', () => {
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

    it('allows file sending retries when reason is "tooMany"', () => {
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

      expect(getByText('Files must be 50 MB or less')).not.toBe(HTMLAnchorElement)
    })
  })
})
