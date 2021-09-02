import PropTypes from 'prop-types'
import TextButton from 'src/TextButton'
import useLabels from 'src/hooks/useLabels'
import { channelIcons } from './channelIcons'
import {
  BigLoadingSpinner,
  ChannelIcon,
  ChannelPillButton,
  Container,
  Content,
  ErrorContainer,
  Instructions,
  LinkErrorText,
  ReloadStroke,
  RetryPositioning,
  Subtitle,
  Title,
} from './styles'

const ChannelLinkWithButton = ({ channelId, url, status, onRetry }) => {
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
        <Instructions>{labels.instructions.mobile}</Instructions>
        {(() => {
          switch (status) {
            case 'error':
              return (
                <ErrorContainer>
                  <LinkErrorText>{genericlabels.buttonError}</LinkErrorText>
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
            case 'success':
              return (
                <ChannelPillButton
                  isPrimary={true}
                  isPill={true}
                  onClick={() => {
                    window.open(url, '_blank', 'noopener,noreferrer')
                  }}
                >
                  {labels.button.mobile}
                </ChannelPillButton>
              )
          }
        })()}
      </Content>
    </Container>
  )
}

ChannelLinkWithButton.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string,
  status: PropTypes.oneOf(['error', 'loading', 'success']),
  onRetry: PropTypes.func,
}

export default ChannelLinkWithButton
