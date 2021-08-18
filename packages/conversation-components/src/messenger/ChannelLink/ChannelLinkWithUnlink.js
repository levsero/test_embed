import PropTypes from 'prop-types'
import useLabels from 'src/hooks/useLabels'
import { channelIcons } from './channelIcons'
import {
  ChannelIcon,
  ChannelPillButton,
  Container,
  Content,
  DisconnectContainer,
  IconPositioning,
  Instructions,
  LinkTickIcon,
  LoadingSpinner,
  Subtitle,
  Title,
  UnlinkLink,
  UnlinkText,
} from './styles'

const ChannelLinkWithUnlink = ({ channelId, onDisconnect, pending }) => {
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
        <Instructions>{labels.instructions.mobile}</Instructions>
        <ChannelPillButton isPrimary={true} isPill={true} target="_blank" rel="noopener noreferrer">
          {labels.button.mobile}
        </ChannelPillButton>
        <DisconnectContainer>
          <IconPositioning>{pending ? <LoadingSpinner /> : <LinkTickIcon />}</IconPositioning>
          <UnlinkText>{labels.disconnectButtonText}</UnlinkText>
          <UnlinkLink isLink={true} onClick={onDisconnect}>
            {labels.disconnectLinkText}
          </UnlinkLink>
        </DisconnectContainer>
      </Content>
    </Container>
  )
}

ChannelLinkWithUnlink.propTypes = {
  channelId: PropTypes.string.isRequired,
  onDisconnect: PropTypes.func.isRequired,
  pending: PropTypes.bool,
}

export default ChannelLinkWithUnlink
