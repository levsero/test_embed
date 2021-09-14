import render from 'src/utils/test/render'
import PrimaryParticipantReceipt from '../'

const renderPrimaryParticipantReceipt = (props = {}) => {
  const defaultProps = {
    status: 'sent',
  }
  return render(<PrimaryParticipantReceipt {...defaultProps} {...props} />)
}

describe('PrimaryParticipantReceipt', () => {
  describe('when receipt status is sent', () => {
    it('renders a receipt', () => {
      const { getByText } = renderPrimaryParticipantReceipt()

      expect(getByText(/Sent/)).toBeInTheDocument
    })

    it('renders status text when message sent recently ', () => {
      const { getByText } = renderPrimaryParticipantReceipt({ timeReceived: Date.now() })
      expect(getByText('Sent · Just now')).toBeInTheDocument
    })

    it('renders a timestamp when sent over a minute ago', () => {
      const { getByText } = renderPrimaryParticipantReceipt({ timeReceived: 1631150648 })

      expect(getByText(/Sent · September 9/)).toBeInTheDocument
    })
  })

  describe('when receipt status is sending', () => {
    it('renders status text for a sending message', () => {
      const { getByText } = renderPrimaryParticipantReceipt({ status: 'sending' })

      expect(getByText('Sending')).toBeInTheDocument
    })
  })

  describe('when receipt status is failed', () => {
    it('renders an error message and retry button when reason is unknown', () => {
      const { getByText } = renderPrimaryParticipantReceipt({
        status: 'failed',
        errorReason: 'unknown',
        isRetryable: true,
      })

      const errorMessage = getByText('Tap to retry')

      expect(errorMessage).toBeInTheDocument
      expect(errorMessage).toBeInstanceOf(HTMLAnchorElement)
    })

    it('fires onRetry when retry button is clicked', () => {
      const onRetry = jest.fn()
      const { getByText } = renderPrimaryParticipantReceipt({
        status: 'failed',
        errorReason: 'unknown',
        isRetryable: true,
        onRetry,
      })

      getByText('Tap to retry').click()

      expect(onRetry).toHaveBeenCalled()
    })

    it('renders an error message and retry button when too many files are uploaded', () => {
      const { getByText } = renderPrimaryParticipantReceipt({
        status: 'failed',
        errorReason: 'tooMany',
        isRetryable: true,
      })

      const errorMessage = getByText('Limit of 25 files per upload. Tap to retry.')

      expect(errorMessage).toBeInTheDocument
      expect(errorMessage).toBeInstanceOf(HTMLAnchorElement)
    })

    it('renders an error message and no retry button when file size exceeds limit', () => {
      const { getByText } = renderPrimaryParticipantReceipt({
        status: 'failed',
        errorReason: 'fileSize',
        isRetryable: false,
      })

      const errorMessage = getByText('Files must be 50 MB or less')

      expect(errorMessage).toBeInTheDocument
      expect(errorMessage).toBeInstanceOf(HTMLParagraphElement)
    })
  })
})
