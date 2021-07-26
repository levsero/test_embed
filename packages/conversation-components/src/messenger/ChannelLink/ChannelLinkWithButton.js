import PropTypes from 'prop-types'
import useLabels from 'src/hooks/useLabels'
import { channelIcons } from './channelIcons'
import {
  Container,
  Title,
  Subtitle,
  ChannelIcon,
  Content,
  Instructions,
  ChannelPillButton,
} from './styles'

const ChannelLinkWithButton = ({ channelId, url }) => {
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
        <ChannelPillButton isPrimary={true} isPill={true} href={url} target="_blank">
          {labels.button.mobile}
        </ChannelPillButton>
      </Content>
    </Container>
  )
}

ChannelLinkWithButton.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string.isRequired,
}

export default ChannelLinkWithButton
