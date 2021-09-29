import PropTypes from 'prop-types'
import TextButton from 'src/TextButton'
import useLabels from 'src/hooks/useLabels'
import { channelIcons } from './channelIcons'
import {
  BigLoadingSpinner,
  ButtonSpinnerContainer,
  ChannelIcon,
  ChannelPillButton,
  Container,
  Content,
  ErrorContainer,
  HiddenText,
  Instructions,
  LinkErrorText,
  LoadingSpinner,
  ReloadStroke,
  RetryPositioning,
  Subtitle,
  Title,
} from './styles'

const ChannelLinkWithButton = ({
  channelId,
  url,
  status,
  onRetry,
  onLinkAttempted,
  businessUsername,
}) => {
  const labels = useLabels().channelLink[channelId]
  const genericlabels = useLabels().channelLink
  const ChannelLogo = channelIcons[channelId]

  return (
    <Container>
      <ChannelIcon>
        <ChannelLogo />
      </ChannelIcon>
      <Title>{labels.title}</Title>
      <Subtitle>{labels.subtitle}</Subtitle>
      <Content>
        <Instructions>{labels.instructions.mobile(businessUsername)}</Instructions>
        {(() => {
          switch (status) {
            case 'error':
              return (
                <ErrorContainer>
                  <LinkErrorText>{genericlabels.linkError.buttonError}</LinkErrorText>
                  <TextButton onClick={onRetry}>
                    <RetryPositioning>
                      {genericlabels.linkError.retry}
                      <ReloadStroke />
                    </RetryPositioning>
                  </TextButton>
                </ErrorContainer>
              )
            case 'loading':
              return <BigLoadingSpinner size="24" />
            case 'pending':
              return (
                <div>
                  <ChannelPillButton isPrimary={true} isPill={true} disabled={true}>
                    <HiddenText aria-hidden={true}>{labels.button.mobile}</HiddenText>
                    <ButtonSpinnerContainer>
                      <LoadingSpinner size="24" />
                    </ButtonSpinnerContainer>
                  </ChannelPillButton>
                  <RetryPositioning>
                    <TextButton onClick={onRetry}>{genericlabels.generateNewLink}</TextButton>
                    <ReloadStroke />
                  </RetryPositioning>
                </div>
              )
            case 'success':
              return (
                <ChannelPillButton
                  isPrimary={true}
                  isPill={true}
                  onClick={() => {
                    onLinkAttempted?.()

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
  status: PropTypes.oneOf(['error', 'loading', 'success', 'pending']),
  onRetry: PropTypes.func,
  onLinkAttempted: PropTypes.func,
  businessUsername: PropTypes.string,
}

export default ChannelLinkWithButton
