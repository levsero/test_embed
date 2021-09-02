import render from 'src/utils/test/render'
import ChannelLinkWithButton from '../ChannelLinkWithButton'

const renderChannelLinkWithButton = (props = {}) => {
  const defaultProps = {
    channelId: 'messenger',
    url: 'www.awesomeurl.com',
    status: 'success',
  }

  return render(<ChannelLinkWithButton {...defaultProps} {...props} />)
}

describe('<ChannelLinkWithButton>', () => {
  describe('when the status is success', () => {
    it('renders a button with channel link url', () => {
      const { getByText } = renderChannelLinkWithButton()

      expect(getByText('Open Messenger')).toBeInTheDocument()

      window.open = jest.fn()
      getByText('Open Messenger').click()
      expect(window.open).toHaveBeenCalled()
    })

    it('opens a new window when clicked', () => {
      const { getByText } = renderChannelLinkWithButton()

      window.open = jest.fn()
      getByText('Open Messenger').click()
      expect(window.open).toHaveBeenCalledWith(
        'www.awesomeurl.com',
        '_blank',
        'noopener,noreferrer'
      )
    })
  })

  describe('when the status is error', () => {
    it('renders an error message and retry button', () => {
      const { getByText } = renderChannelLinkWithButton({ status: 'error' })

      expect(getByText("Link couldn't be loaded")).toBeInTheDocument()
      expect(getByText('Click to retry')).toBeInTheDocument()
    })

    it('fires onRetry when retry button is clicked', () => {
      const onRetry = jest.fn()
      const { getByText } = renderChannelLinkWithButton({ onRetry, status: 'error' })

      getByText('Click to retry').click()

      expect(onRetry).toHaveBeenCalled()
    })
  })

  describe('when the status is loading', () => {
    it('renders a loading spinner', () => {
      const { getByRole } = renderChannelLinkWithButton({ status: 'loading' })

      expect(getByRole('progressbar')).toBeInTheDocument()
    })
  })
})
