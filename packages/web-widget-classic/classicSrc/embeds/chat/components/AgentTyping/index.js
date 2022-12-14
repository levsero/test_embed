import { TEST_IDS } from 'classicSrc/constants/shared'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { LoadingDots, Container } from './styles'

const oneAgentTyping = (translate, agentsTyping) => {
  const agent = agentsTyping[0].display_name
  return translate('embeddable_framework.chat.chatLog.isTyping', { agent })
}

const twoAgentsTyping = (translate, agentsTyping) => {
  const agent1 = agentsTyping[0].display_name,
    agent2 = agentsTyping[1].display_name

  return translate('embeddable_framework.chat.chatLog.isTyping_two', {
    agent1,
    agent2,
  })
}

const manyAgentsTyping = (translate) => {
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

const AgentTyping = forwardRef(({ agentsTyping = [] }, ref) => {
  const translate = useTranslate()

  return (
    <div aria-live="polite" ref={ref}>
      {agentsTyping.length !== 0 && (
        <Container>
          <LoadingDots data-testid={TEST_IDS.ICON_ELLIPSIS} />
          {message(translate, agentsTyping)}
        </Container>
      )}
    </div>
  )
})

AgentTyping.propTypes = {
  agentsTyping: PropTypes.array,
}

export default AgentTyping
