import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Widget, Main, Footer } from 'src/components/Widget'
import ChatHeader from 'src/embeds/chat/components/ChatHeader'
import ChatWidgetHeader from 'src/embeds/chat/components/ChatWidgetHeader'
import FeedbackForm from 'src/embeds/chat/components/FeedbackForm'
import useTranslate from 'src/hooks/useTranslate'
import {
  sendChatRating,
  sendLastChatRatingInfo,
  sendChatComment,
  endChat,
  updateChatScreen,
} from 'src/redux/modules/chat'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import {
  getIsChatting,
  getChatRating,
  getAgentEndedChatSession,
} from 'src/redux/modules/chat/chat-selectors'

const mapStateToProps = (state) => {
  return {
    isChatting: getIsChatting(state),
    rating: getChatRating(state),
    isAgentEndedChatSession: getAgentEndedChatSession(state),
  }
}

const ChatRatingPage = ({
  rating,
  sendChatRating,
  sendChatComment,
  sendLastChatRatingInfo,
  updateChatScreen,
  isAgentEndedChatSession,
}) => {
  const translate = useTranslate()

  const handleCancel = () => {
    updateChatScreen(CHATTING_SCREEN)
  }

  const handleSubmit = (newRating, text) => {
    // We need to use an internal Web SDK API `sendLastChatRatingInfo` to update
    // chat rating if the chat session has ended by the agent in Agent Workspace
    if (isAgentEndedChatSession) {
      const lastChatRatingInfo = {
        rating: newRating,
      }

      if (text) lastChatRatingInfo.comment = text
      sendLastChatRatingInfo(lastChatRatingInfo)
    } else {
      sendChatRating(newRating)
      if (text) sendChatComment(text)
    }

    updateChatScreen(CHATTING_SCREEN)
  }

  return (
    <Widget>
      <ChatWidgetHeader />
      <ChatHeader />

      <Main>
        <FeedbackForm
          rating={rating}
          handleSecondaryButtonClick={handleCancel}
          submitForm={handleSubmit}
          secondaryButtonText={translate('embeddable_framework.common.button.cancel')}
        />
      </Main>
      <Footer />
    </Widget>
  )
}

const actionCreators = {
  sendChatRating,
  sendChatComment,
  sendLastChatRatingInfo,
  endChat,
  updateChatScreen,
}

ChatRatingPage.propTypes = {
  rating: PropTypes.object.isRequired,
  sendChatRating: PropTypes.func.isRequired,
  sendChatComment: PropTypes.func.isRequired,
  sendLastChatRatingInfo: PropTypes.func.isRequired,
  updateChatScreen: PropTypes.func.isRequired,
  isAgentEndedChatSession: PropTypes.bool.isRequired,
}

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  ChatRatingPage
)

export { connectedComponent as default, ChatRatingPage as Component }
