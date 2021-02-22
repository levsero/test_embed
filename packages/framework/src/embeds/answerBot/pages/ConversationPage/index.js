import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import MessageGroup from 'src/embeds/answerBot/components/MessageGroup'
import { conversationScreenClosed } from 'src/embeds/answerBot/actions/conversation'
import { getMessageGroupKeys } from 'src/embeds/answerBot/selectors/conversation'
import { updateBackButtonVisibility } from 'src/redux/modules/base/base-actions'
import { getSettingsAnswerBotAvatarUrl } from 'src/redux/modules/settings/settings-selectors'
import { getSettingsAnswerBotAvatarName } from 'src/redux/modules/selectors'
import { Container } from './styles'

const ConversationPage = ({
  actions,
  messageGroups,
  scrollToBottom,
  agentAvatarName,
  agentAvatarUrl,
}) => {
  useEffect(() => {
    actions.updateBackButtonVisibility(false)

    return () => {
      actions.conversationScreenClosed()
    }
  }, [actions])
  return (
    <Container>
      {_.map(messageGroups, (group, key) => (
        <MessageGroup
          key={key}
          isVisitor={!!group.isVisitor}
          messageKeys={group.messageKeys}
          scrollToBottom={scrollToBottom}
          agentAvatarName={agentAvatarName}
          agentAvatarUrl={agentAvatarUrl}
        />
      ))}
    </Container>
  )
}

ConversationPage.propTypes = {
  messageGroups: PropTypes.object.isRequired,
  scrollToBottom: PropTypes.func,
  actions: PropTypes.shape({
    conversationScreenClosed: PropTypes.func.isRequired,
    updateBackButtonVisibility: PropTypes.func.isRequired,
  }),
  agentAvatarUrl: PropTypes.string,
  agentAvatarName: PropTypes.string,
}

ConversationPage.defaultProps = {
  scrollToBottom: () => {},
  agentAvatarName: '',
  agentAvatarUrl: '',
}

const mapStateToProps = (state) => {
  return {
    messageGroups: getMessageGroupKeys(state),
    agentAvatarName: getSettingsAnswerBotAvatarName(state),
    agentAvatarUrl: getSettingsAnswerBotAvatarUrl(state),
  }
}

const actionCreators = (dispatch) => ({
  actions: bindActionCreators(
    {
      conversationScreenClosed,
      updateBackButtonVisibility,
    },
    dispatch
  ),
})

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  ConversationPage
)

export { connectedComponent as default, ConversationPage as Component }
