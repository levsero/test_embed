import userEvent from '@testing-library/user-event'
import * as messageLogStore from 'messengerSrc/features/messageLog/store'
import { render } from 'messengerSrc/utils/testHelpers'
import ImageStructuredMessage from '../ImageStructuredMessage'

jest.mock('messengerSrc/api/sunco', () => ({
  sendFile: jest.fn(),
}))

describe('ImageStructuredMessage', () => {
  const defaultProps = {
    message: {
      _id: 'ab13d4d55s4sc1232',
      role: 'appUser',
    },
  }

  const renderComponent = (props = {}) => {
    return render(<ImageStructuredMessage {...defaultProps} {...props} />)
  }

  it('uses the altText value from the message', () => {
    const { queryByAltText } = renderComponent({
      message: {
        ...defaultProps.message,
        altText: 'This is alt text',
      },
    })

    expect(queryByAltText('This is alt text')).toBeInTheDocument()
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
    it('allows the user to retry sending the image when reason is "unknown"', () => {
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

      expect(messageLogStore.sendFile).toHaveBeenCalledWith({ messageId: 'ab13d4d55s4sc1232' })
    })

    it('allows the user to retry sending the image when reason is "tooMany"', () => {
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

      expect(messageLogStore.sendFile).toHaveBeenCalledWith({ messageId: 'ab13d4d55s4sc1232' })
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

      expect(messageLogStore.sendFile).not.toHaveBeenCalled()
    })
  })
})
