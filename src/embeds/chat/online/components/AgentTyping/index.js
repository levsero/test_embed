import React from 'react'
import PropTypes from 'prop-types'
import { LoadingDots, Container } from './styles'
import { TEST_IDS } from 'src/constants/shared'
import { useTranslate } from 'src/hooks/useTranslation'

const oneAgentTyping = (translate, agentsTyping) => {
  const agent = agentsTyping[0].display_name
  return translate('embeddable_framework.chat.chatLog.isTyping', { agent })
}

const twoAgentsTyping = (translate, agentsTyping) => {
  const agent1 = agentsTyping[0].display_name,
    agent2 = agentsTyping[1].display_name

  return translate('embeddable_framework.chat.chatLog.isTyping_two', {
    agent1,
    agent2
  })
}

const manyAgentsTyping = translate => {
  return translate('embeddable_framework.chat.chatLog.isTyping_multiple')
}

const message = (translate, agentsTyping) => {
  switch (agentsTyping.length) {
    case 1:
      return oneAgentTyping(translate, agentsTyping)
    case 2:
      return twoAgentsTyping(translate, agentsTyping)
    default:
      return manyAgentsTyping(translate)
  }
}

export const AgentTyping = ({ agentsTyping = [] }) => {
  const translate = useTranslate()

  return (
    <Container>
      {agentsTyping.length != 0 && (
        <div aria-live="polite">
          <LoadingDots data-testid={TEST_IDS.ICON_ELLIPSIS} />
          {message(translate, agentsTyping)}
        </div>
      )}
    </Container>
  )
}

AgentTyping.propTypes = {
  agentsTyping: PropTypes.array
}
