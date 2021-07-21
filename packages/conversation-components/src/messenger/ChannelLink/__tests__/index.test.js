import render from 'src/utils/test/render'

import { ChannelLinkWithQrCode, ChannelLinkWithButton } from '../'

const renderChannelLinkWithQrCode = (props = {}) => {
  const defaultProps = {
    channelId: 'messenger',
    url: 'www.awesomeurl.com',
    handleBackButtonClick: () => {},
  }

  return render(<ChannelLinkWithQrCode {...defaultProps} {...props} />)
}

const renderChannelLinkWithButton = (props = {}) => {
  const defaultProps = {
    channelId: 'messenger',
    url: 'www.awesomeurl.com',
    handleBackButtonClick: () => {},
  }

  return render(<ChannelLinkWithButton {...defaultProps} {...props} />)
}

describe('<ChannelLinkWithQrCode>', () => {
  it('renders a QR code', () => {
    const { getByTestId } = renderChannelLinkWithQrCode()

    expect(getByTestId('generatedQRCode')).toBeInTheDocument()
  })

  it('renders a link with channel link url', () => {
    const { getByText } = renderChannelLinkWithQrCode()

    expect(getByText('Open Messenger on this device')).toBeInTheDocument()
  })
})

describe('<ChannelLinkWithButton>', () => {
  it('renders a button with channel link url', () => {
    const { getByText } = renderChannelLinkWithButton()

    expect(getByText('Open Messenger')).toBeInTheDocument()
  })
})
