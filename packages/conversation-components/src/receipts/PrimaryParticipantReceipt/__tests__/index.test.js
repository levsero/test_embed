import render from 'src/utils/test/render'
import PrimaryParticipantReceipt from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    status: 'sent',
  }
  return render(<PrimaryParticipantReceipt {...defaultProps} {...props} />)
}

describe('PrimaryParticipantReceipt', () => {
  describe('when receipt status is sent', () => {
    it('renders a receipt', () => {
      const { queryByText } = renderComponent()

      expect(queryByText(/Sent/)).toBeInTheDocument()
    })

    it('renders status text when message sent recently ', () => {
      const { queryByText } = renderComponent({ timeReceived: Date.now() })
      expect(queryByText('Sent · Just now')).toBeInTheDocument()
    })

    it('renders a timestamp when sent over a minute ago', () => {
      const { queryByText } = renderComponent({ timeReceived: 1631150648 })

      expect(queryByText(/Sent · September 9/)).toBeInTheDocument()
    })
  })

  describe('when receipt status is sending', () => {
    it('renders status text for a sending message', () => {
      const { queryByText } = renderComponent({ status: 'sending' })

      expect(queryByText('Sending')).toBeInTheDocument()
    })
  })

  describe('when receipt status is failed', () => {
    it('fires onRetry when retry button is clicked', () => {
      const onRetry = jest.fn()
      const { queryByText } = renderComponent({
        status: 'failed',
        errorReason: 'unknown',
        isRetryable: true,
        onRetry,
      })

      queryByText('Tap to retry').click()

      expect(onRetry).toHaveBeenCalled()
    })

    it('renders an error message and retry button when too many files are uploaded', () => {
      const onRetry = jest.fn()
      const { queryByText } = renderComponent({
        status: 'failed',
        errorReason: 'tooMany',
        isRetryable: true,
        onRetry,
      })

      queryByText('Limit of 25 files per upload. Tap to retry.').click()

      expect(onRetry).toHaveBeenCalled()
    })

    it('renders an error message and no retry button when file size exceeds limit', () => {
      const onRetry = jest.fn()
      const { queryByText } = renderComponent({
        status: 'failed',
        errorReason: 'fileSize',
        isRetryable: false,
        onRetry,
      })

      queryByText('Files must be 50 MB or less').click()

      expect(onRetry).not.toHaveBeenCalled()
    })
  })
})
