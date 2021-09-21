import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import TextButton from 'src/TextButton'
import useLabels from 'src/hooks/useLabels'
import { channelIcons } from './channelIcons'
import {
  BigLoadingSpinner,
  ChannelIcon,
  Container,
  Content,
  ErrorContainer,
  Instructions,
  LinkErrorText,
  LoadingSpinner,
  QRCodeWrapper,
  QRSpaceContainer,
  ReloadStroke,
  RetryPositioning,
  Subtitle,
  Title,
} from './styles'

const ChannelLinkWithQrCode = ({
  channelId,
  url,
  qrCode,
  status,
  onRetry,
  onLinkAttempted,
  businessUsername,
}) => {
  const labels = useLabels().channelLink[channelId]
  const genericlabels = useLabels().channelLink.linkError
  const ChannelLogo = channelIcons[channelId]

  return (
    <Container>
      <ChannelIcon>
        <ChannelLogo />
      </ChannelIcon>
      <Title>{labels.title}</Title>
      <Subtitle>{labels.subtitle}</Subtitle>
      <Content>
        <Instructions>{labels.instructions.desktop(businessUsername)}</Instructions>
        {(() => {
          switch (status) {
            case 'error':
              return (
                <ErrorContainer>
                  <LinkErrorText>{genericlabels.qrError}</LinkErrorText>
                  <TextButton onClick={onRetry}>
                    <RetryPositioning>
                      {genericlabels.retry}
                      <ReloadStroke />
                    </RetryPositioning>
                  </TextButton>
                </ErrorContainer>
              )
            case 'loading':
              return <BigLoadingSpinner size="24" />
            case 'pending':
              return (
                <>
                  <QRSpaceContainer>
                    <LoadingSpinner size="24" />
                  </QRSpaceContainer>
                  <RetryPositioning>
                    <TextButton onClick={onRetry}>Generate new QR code</TextButton>
                    <ReloadStroke />
                  </RetryPositioning>
                </>
              )
            case 'success':
              return (
                <>
                  <QRCodeWrapper>
                    {qrCode ? (
                      <img src={qrCode} alt={labels.qrCodeAlt} />
                    ) : (
                      <QRCode value={url} renderAs="svg" aria-label={labels.qrCodeAlt} />
                    )}
                  </QRCodeWrapper>
                  <TextButton href={url} onClick={onLinkAttempted}>
                    {labels.button.desktop}
                  </TextButton>
                </>
              )
          }
        })()}
      </Content>
    </Container>
  )
}

ChannelLinkWithQrCode.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string,
  qrCode: PropTypes.string,
  status: PropTypes.oneOf(['error', 'loading', 'success', 'pending']),
  onRetry: PropTypes.func,
  onLinkAttempted: PropTypes.func,
  businessUsername: PropTypes.string,
}

export default ChannelLinkWithQrCode
