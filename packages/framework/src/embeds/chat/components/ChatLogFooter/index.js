import PropTypes from 'prop-types'
import * as React from 'react'
import ZendeskLogo from 'src/components/ZendeskLogo'
import AgentTyping from 'src/embeds/chat/components/AgentTyping'
import { LogoContainer } from './styles'

const ChatLogFooter = React.forwardRef(
  ({ agentsTyping, hideZendeskLogo = false, isMobile = false }, forwardRef) => {
    if (agentsTyping.length > 0) return <AgentTyping agentsTyping={agentsTyping} ref={forwardRef} />

    if (!hideZendeskLogo && isMobile)
      return (
        <LogoContainer>
          <ZendeskLogo linkToChat={true} />
        </LogoContainer>
      )

    return null
  }
)

ChatLogFooter.propTypes = {
  agentsTyping: PropTypes.array,
  hideZendeskLogo: PropTypes.bool,
  isMobile: PropTypes.bool,
}

export default ChatLogFooter
