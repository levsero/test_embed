import render from 'src/utils/test/render'
import ChannelLinkWithQrCode from '../ChannelLinkWithQrCode'

const renderChannelLinkWithQrCode = (props = {}) => {
  const defaultProps = {
    channelId: 'messenger',
    url: 'www.awesomeurl.com',
    status: 'success',
  }

  return render(<ChannelLinkWithQrCode {...defaultProps} {...props} />)
}

describe('<ChannelLinkWithQrCode>', () => {
  describe('when the status is success', () => {
    describe('when a QR code is supplied as a prop', () => {
      it('renders a QR code as an image', () => {
        const { getByAltText } = renderChannelLinkWithQrCode({ qrCode: 'path/to/qrCode.png' })

        expect(getByAltText('QR code to open Messenger on this device')).toBeInTheDocument()
      })
    })

    it('renders a link with channel link url', () => {
      const { getByText } = renderChannelLinkWithQrCode()

      expect(getByText('Open Messenger on this device')).toBeInTheDocument()
    })
  })

  describe('when the status is error', () => {
    it('renders an error message and retry button', () => {
      const { getByText } = renderChannelLinkWithQrCode({ status: 'error' })

      expect(getByText("QR code couldn't be loaded")).toBeInTheDocument()
      expect(getByText('Click to retry')).toBeInTheDocument()
    })

    it('fires onRetry when retry button is clicked', () => {
      const onRetry = jest.fn()
      const { getByText } = renderChannelLinkWithQrCode({ onRetry, status: 'error' })

      getByText('Click to retry').click()

      expect(onRetry).toHaveBeenCalled()
    })
  })

  describe('when the status is loading', () => {
    it('renders a loading spinner', () => {
      const { getByRole } = renderChannelLinkWithQrCode({ status: 'loading' })

      expect(getByRole('progressbar')).toBeInTheDocument()
    })
  })
})
