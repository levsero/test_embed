import render from 'src/utils/test/render'
import ChannelLinkWithQrCode from '../ChannelLinkWithQrCode'

const renderChannelLinkWithQrCode = (props = {}) => {
  const defaultProps = {
    channelId: 'messenger',
    url: 'www.awesomeurl.com',
  }

  return render(<ChannelLinkWithQrCode {...defaultProps} {...props} />)
}

describe('<ChannelLinkWithQrCode>', () => {
  describe('when a QR code is supplied as a prop', () => {
    it('renders a QR code as an image', () => {
      const { getByAltText } = renderChannelLinkWithQrCode({ qrCode: 'path/to/qrCode.png' })

      expect(getByAltText('QR code to open Messenger on this device')).toBeInTheDocument()
    })
  })

  describe('when a QR code is not supplied as a prop', () => {
    it('renders a generated QR code', () => {
      const { getByTestId } = renderChannelLinkWithQrCode()

      expect(getByTestId('generatedQRCode')).toBeInTheDocument()
    })
  })

  it('renders a link with channel link url', () => {
    const { getByText } = renderChannelLinkWithQrCode()

    expect(getByText('Open Messenger on this device')).toBeInTheDocument()
  })
})
