import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import useLabels from 'src/hooks/useLabels'
import { channelIcons } from './channelIcons'
import {
  BigLoadingSpinner,
  ChannelIcon,
  ChannelLinkButton,
  Container,
  Content,
  ErrorContainer,
  Instructions,
  LinkErrorText,
  LinkRetryButton,
  QRCodeWrapper,
  ReloadStroke,
  RetryPositioning,
  Subtitle,
  Title,
} from './styles'

const ChannelLinkWithQrCode = ({ channelId, url, qrCode, status, onRetry }) => {
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
        <Instructions>{labels.instructions.desktop}</Instructions>
        {(() => {
          switch (status) {
            case 'error':
              return (
                <ErrorContainer>
                  <LinkErrorText>{genericlabels.qrError}</LinkErrorText>
                  <LinkRetryButton isLink={true} onClick={onRetry}>
                    <RetryPositioning>
                      {genericlabels.retry}
                      <ReloadStroke />
                    </RetryPositioning>
                  </LinkRetryButton>
                </ErrorContainer>
              )
            case 'loading':
              return <BigLoadingSpinner size="24" />
            case 'success':
              return (
                <>
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
  status: PropTypes.oneOf(['error', 'loading', 'success']),
  onRetry: PropTypes.func,
}

export default ChannelLinkWithQrCode
