import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AgentList from 'src/embeds/chat/online/components/AgentList'
import { Button } from '@zendeskgarden/react-buttons'
import { updateChatScreen } from 'src/redux/modules/chat'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import { Widget, Header, Main, Footer } from 'components/Widget'
import useTranslation from 'src/hooks/useTranslation'

const AgentDetailsPage = ({ updateChatScreen }) => {
  const title = useTranslation('embeddable_framework.helpCenter.label.link.chat')
  const backButtonLabel = useTranslation('embeddable_framework.chat.agentList.button.backToChat')

  return (
    <Widget>
      <Header title={title} />
      <Main>
        <AgentList />
      </Main>
      <Footer>
        <Button primary={true} onClick={() => updateChatScreen(CHATTING_SCREEN)}>
          {backButtonLabel}
        </Button>
      </Footer>
    </Widget>
  )
}

AgentDetailsPage.propTypes = {
  updateChatScreen: PropTypes.func.isRequired
}

const actionCreators = { updateChatScreen }

const connectedComponent = connect(
  null,
  actionCreators
)(AgentDetailsPage)

export { connectedComponent as default, AgentDetailsPage as Component }
