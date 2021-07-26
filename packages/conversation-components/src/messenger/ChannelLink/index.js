import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import useLabels from 'src/hooks/useLabels'
import InstagramIcon from '../MessengerHeader/Menu/InstagramIcon'
import MessengerIcon from '../MessengerHeader/Menu/MessengerIcon'
import WhatsAppIcon from '../MessengerHeader/Menu/WhatsAppIcon'
import {
  Container,
  Title,
  Subtitle,
  ChannelIcon,
  Content,
  Instructions,
  QRCodeWrapper,
  ChannelLinkButton,
  ChannelPillButton,
} from './styles'

export const icons = {
  whatsapp: WhatsAppIcon,
  messenger: MessengerIcon,
  instagram: InstagramIcon,
}

export const ChannelLinkWithQrCode = ({ channelId, url, qrCode }) => {
  const labels = useLabels().channelLink[channelId]
  const ChannelLogo = icons[channelId]

  return (
    <Container>
      <ChannelIcon>
        <ChannelLogo />
      </ChannelIcon>
      <Title>{labels.title}</Title>
      <Subtitle>{labels.subtitle}</Subtitle>
      <Content>
        <Instructions>{labels.instructions.desktop}</Instructions>
        <QRCodeWrapper>
          {qrCode ? (
            <img src={qrCode} alt={labels.qrCodeAlt} />
          ) : (
            <QRCode
              data-testid="generatedQRCode"
              value={url}
              renderAs="svg"
              aria-labelledby={labels.qrCodeAlt}
            />
          )}
        </QRCodeWrapper>
        <ChannelLinkButton href={url} target="_blank">
          {labels.button.desktop}
        </ChannelLinkButton>
      </Content>
    </Container>
  )
}

export const ChannelLinkWithButton = ({ channelId, url }) => {
  const labels = useLabels().channelLink[channelId]
  const ChannelLogo = icons[channelId]

  return (
    <Container>
      <ChannelIcon>
        <ChannelLogo />
      </ChannelIcon>
      <Title>{labels.title}</Title>
      <Subtitle>{labels.subtitle}</Subtitle>
      <Content>
        <Instructions>{labels.instructions.mobile}</Instructions>
        <ChannelPillButton isPrimary={true} isPill={true} href={url} target="_blank">
          {labels.button.mobile}
        </ChannelPillButton>
      </Content>
    </Container>
  )
}

ChannelLinkWithQrCode.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string.isRequired,
  qrCode: PropTypes.string,
}

ChannelLinkWithButton.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string.isRequired,
}
