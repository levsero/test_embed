import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AgentList from 'src/embeds/chat/components/AgentList'
import { Button } from '@zendeskgarden/react-buttons'
import { updateChatScreen } from 'src/redux/modules/chat'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import { Widget, Header, Main, Footer } from 'components/Widget'
import useTranslate from 'src/hooks/useTranslate'

const AgentDetailsPage = ({ updateChatScreen }) => {
  const translate = useTranslate()

  return (
    <Widget>
      <Header title={translate('embeddable_framework.helpCenter.label.link.chat')} />
      <Main>
        <AgentList />
      </Main>
      <Footer>
        <Button isPrimary={true} onClick={() => updateChatScreen(CHATTING_SCREEN)}>
          {translate('embeddable_framework.chat.agentList.button.backToChat')}
        </Button>
      </Footer>
    </Widget>
  )
}

AgentDetailsPage.propTypes = {
  updateChatScreen: PropTypes.func.isRequired,
}

const actionCreators = { updateChatScreen }

const connectedComponent = connect(null, actionCreators)(AgentDetailsPage)

export { connectedComponent as default, AgentDetailsPage as Component }
