import PropTypes from 'prop-types'
import TextButton from 'src/TextButton'
import useLabels from 'src/hooks/useLabels'
import { channelIcons } from './channelIcons'
import {
  ChannelIcon,
  ChannelPillButton,
  Container,
  Content,
  ConnectionStatusInfo,
  DisconnectContainer,
  IconPositioning,
  Instructions,
  LinkTickIcon,
  LoadingSpinner,
  Subtitle,
  Title,
  UnlinkText,
} from './styles'

const ChannelLinkWithUnlink = ({ channelId, onDisconnect, pending, businessUsername }) => {
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
        <Instructions>{labels.instructions.mobile(businessUsername)}</Instructions>
        <ChannelPillButton isPrimary={true} isPill={true} target="_blank" rel="noopener noreferrer">
          {labels.button.mobile}
        </ChannelPillButton>
        <DisconnectContainer>
          <ConnectionStatusInfo>
            <IconPositioning>{pending ? <LoadingSpinner /> : <LinkTickIcon />}</IconPositioning>
            <UnlinkText>{labels.disconnectButtonText}</UnlinkText>
          </ConnectionStatusInfo>
          <TextButton onClick={onDisconnect}>{labels.disconnectLinkText}</TextButton>
        </DisconnectContainer>
      </Content>
    </Container>
  )
}

ChannelLinkWithUnlink.propTypes = {
  channelId: PropTypes.string.isRequired,
  onDisconnect: PropTypes.func.isRequired,
  pending: PropTypes.bool,
  businessUsername: PropTypes.string,
}

export default ChannelLinkWithUnlink
