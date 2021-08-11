import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import useLabels from 'src/hooks/useLabels'
import { channelIcons } from './channelIcons'
import {
  Container,
  Title,
  Subtitle,
  ChannelIcon,
  Content,
  Instructions,
  QRCodeWrapper,
  ChannelLinkButton,
} from './styles'

const ChannelLinkWithQrCode = ({ channelId, url, qrCode }) => {
  const labels = useLabels().channelLink[channelId]
  const ChannelLogo = channelIcons[channelId]

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
              aria-label={labels.qrCodeAlt}
            />
          )}
        </QRCodeWrapper>
        <ChannelLinkButton href={url} target="_blank" rel="noopener noreferrer">
          {labels.button.desktop}
        </ChannelLinkButton>
      </Content>
    </Container>
  )
}

ChannelLinkWithQrCode.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string.isRequired,
  qrCode: PropTypes.string,
}

export default ChannelLinkWithQrCode
