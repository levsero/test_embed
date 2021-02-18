import React from 'react'
import PropTypes from 'prop-types'

import Avatar from 'components/Avatar'
import { ICONS } from 'src/constants/shared'
import { Container, TextContainer, AgentName, AgentTitle } from './styles'

const AgentInfo = ({ agent }) => (
  <Container>
    <Avatar src={agent.avatar_path} fallbackIcon={ICONS.AGENT_AVATAR} />
    <TextContainer>
      <AgentName>{agent.display_name}</AgentName>
      <AgentTitle>{agent.title}</AgentTitle>
    </TextContainer>
  </Container>
)

AgentInfo.propTypes = {
  agent: PropTypes.shape({
    nick: PropTypes.string,
    isTyping: PropTypes.bool,
    title: PropTypes.string,
    display_name: PropTypes.string,
  }).isRequired,
}

export default AgentInfo
