import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import WhatsAppIcon from '../MessengerHeader/Menu/WhatsAppIcon'
import MessengerIcon from '../MessengerHeader/Menu/MessengerIcon'
import InstagramIcon from '../MessengerHeader/Menu/InstagramIcon'
import BackButton from './BackButton'
// import useLabels from 'src/hooks/useLabels'

import {
  Body,
  Title,
  Subtitle,
  ChannelIcon,
  Header,
  Content,
  Instructions,
  QRCodeWrapper,
  ChannelLinkButton,
  ChannelPillButton,
} from './styles'

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

export const ChannelLinkWithQrCode = ({ channelId, url, qrCode, handleBackButtonClick }) => {
  const { title, subtitle, icon: ChannelLogo, instructions, button, qrCodeAlt } = channelOptions[
    channelId
  ]
  // const labels = useLabels().messengerHeader

  return (
    <>
      <Header>
        <BackButton
          onClick={handleBackButtonClick}
          // ariaLabel={labels.channelLinkingMenuAriaLabel}
          ariaLabel={'Back to conversation'}
        />
      </Header>
      <Body>
        <ChannelIcon>
          <ChannelLogo />
        </ChannelIcon>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
        <Content>
          <Instructions>{instructions.desktop}</Instructions>
          <QRCodeWrapper>
            {qrCode ? (
              <img src={qrCode} alt={qrCodeAlt} />
            ) : (
              <QRCode
                data-testid="generatedQRCode"
                value={url}
                renderAs="svg"
                aria-labelledby={qrCodeAlt}
              />
            )}
          </QRCodeWrapper>
          <ChannelLinkButton href={url} target="_blank">
            {button.desktop}
          </ChannelLinkButton>
        </Content>
      </Body>
    </>
  )
}

export const ChannelLinkWithButton = ({ channelId, url, handleBackButtonClick }) => {
  const { title, subtitle, icon: ChannelLogo, instructions, button } = channelOptions[channelId]
  // const labels = useLabels().messengerHeader

  return (
    <>
      <Header>
        <BackButton
          onClick={handleBackButtonClick}
          // ariaLabel={labels.channelLinkingMenuAriaLabel}
          ariaLabel={'Back to conversation'}
        />
      </Header>
      <Body>
        <ChannelIcon>
          <ChannelLogo />
        </ChannelIcon>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
        <Content>
          <Instructions>{instructions.mobile}</Instructions>
          <ChannelPillButton isPrimary={true} isPill={true} href={url} target="_blank">
            {button.mobile}
          </ChannelPillButton>
        </Content>
      </Body>
    </>
  )
}

ChannelLinkWithQrCode.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string.isRequired,
  qrCode: PropTypes.string,
  handleBackButtonClick: PropTypes.func,
}

ChannelLinkWithButton.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string.isRequired,
  handleBackButtonClick: PropTypes.func,
}
