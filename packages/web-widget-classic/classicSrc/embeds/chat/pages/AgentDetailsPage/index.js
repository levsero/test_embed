import { Widget, Header, Main, Footer } from 'classicSrc/components/Widget'
import AgentList from 'classicSrc/embeds/chat/components/AgentList'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { updateChatScreen } from 'classicSrc/redux/modules/chat'
import { CHATTING_SCREEN } from 'classicSrc/redux/modules/chat/chat-screen-types'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from '@zendeskgarden/react-buttons'

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
