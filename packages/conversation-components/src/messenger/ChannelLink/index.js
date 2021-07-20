import PropTypes from 'prop-types'
import WhatsAppIcon from '../MessengerHeader/Menu/WhatsAppIcon'
import MessengerIcon from '../MessengerHeader/Menu/MessengerIcon'
import InstagramIcon from '../MessengerHeader/Menu/InstagramIcon'
import BackButton from './BackButton'
// import useLabels from 'src/hooks/useLabels'

import ChannelLinkQRCode from './components/ChannelLink'

import { Body, Title, Subtitle, ChannelIcon, Header } from './styles'

export const channelOptions = {
  whatsapp: {
    icon: WhatsAppIcon,
    title: 'Continue on WhatsApp',
    subtitle: 'Take the conversation to your WhatsApp account. You can return anytime.',
    instructions: {
      desktop: 'Scan the QR code and then send the message that appears in your WhatsApp.',
      mobile: 'Open WhatsApp and send a short message to connect your account.',
    },
    qrCodeAlt: 'QR code to open WhatsApp on this device',
    button: {
      desktop: 'Open WhatsApp on this device',
      mobile: 'Open WhatsApp',
    },
  },
  messenger: {
    icon: MessengerIcon,
    title: 'Continue on Messenger',
    subtitle: 'Take the conversation to your Messenger account. You can return anytime.',
    instructions: {
      desktop: 'Scan the QR code and then send the message that appears in your Messenger.',
      mobile: 'Open Messenger and send a short message to connect your account.',
    },
    qrCodeAlt: 'QR code to open Messenger on this device',
    button: {
      desktop: 'Open Messenger on this device',
      mobile: 'Open Messenger',
    },
  },
  instagram: {
    icon: InstagramIcon,
    title: 'Continue on Instagram',
    subtitle: 'Take the conversation to your Instagram account. You can return anytime.',
    instructions: {
      desktop: 'Scan the QR code to open Instagram. Follow @[Instagram handle] to send a DM.',
      mobile: 'Follow @[Instagram handle] to send a DM.',
    },
    qrCodeAlt: 'QR code to open Instagram on this device',
    button: {
      desktop: 'Open Instagram on this device',
      mobile: 'Open Instagram',
    },
  },
}

const ChannelLink = ({ channelId, url, qrCode, handleBackButtonClick }) => {
  const { title, subtitle, icon: ChannelLogo } = channelOptions[channelId]
  // const labels = useLabels().messengerHeader

  return (
    <>
      <Header>
        <BackButton
          onClick={handleBackButtonClick}
          // ariaLabel={labels.channelLinkingMenuAriaLabel}
          ariaLabel={'placeholderBackButton'}
        />
      </Header>
      <Body>
        <ChannelIcon>
          <ChannelLogo />
        </ChannelIcon>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>

        <ChannelLinkQRCode channelId={channelId} url={url} qrCode={qrCode} />
      </Body>
    </>
  )
}

export default ChannelLink

ChannelLink.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string.isRequired,
  qrCode: PropTypes.string,
  handleBackButtonClick: PropTypes.func,
}
