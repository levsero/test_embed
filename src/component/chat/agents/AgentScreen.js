import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AgentList } from 'component/chat/agents/AgentList'
import { Button } from '@zendeskgarden/react-buttons'
import { updateChatScreen } from 'src/redux/modules/chat'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import { getActiveAgents } from 'src/redux/modules/chat/chat-selectors'
import { Widget, Header, Main, Footer } from 'components/Widget'
import useTranslation from 'src/hooks/useTranslation'

const mapStateToProps = state => {
  return {
    activeAgents: getActiveAgents(state)
  }
}

const AgentScreen = ({ activeAgents, updateChatScreen }) => {
  const title = useTranslation('embeddable_framework.helpCenter.label.link.chat')
  const backButtonLabel = useTranslation('embeddable_framework.chat.agentList.button.backToChat')

  return (
    <Widget>
      <Header title={title} />
      <Main>
        <AgentList agents={activeAgents} />
      </Main>
      <Footer>
        <Button
          primary={true}
          onClick={() => {
            updateChatScreen(CHATTING_SCREEN)
          }}
        >
          {backButtonLabel}
        </Button>
      </Footer>
    </Widget>
  )
}

AgentScreen.propTypes = {
  activeAgents: PropTypes.object.isRequired,
  updateChatScreen: PropTypes.func.isRequired
}

const actionCreators = { updateChatScreen }

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(AgentScreen)

export { connectedComponent as default, AgentScreen as Component }
