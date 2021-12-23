import { Widget, Main, Footer } from 'classicSrc/components/Widget'
import ChatHeader from 'classicSrc/embeds/chat/components/ChatHeader'
import ChatWidgetHeader from 'classicSrc/embeds/chat/components/ChatWidgetHeader'
import FeedbackForm from 'classicSrc/embeds/chat/components/FeedbackForm'
import {
  getIsChatting,
  getChatRating,
  getAgentEndedChatSession,
} from 'classicSrc/embeds/chat/selectors'
import useTranslate from 'classicSrc/hooks/useTranslate'
import {
  sendChatRating,
  sendLastChatRatingInfo,
  sendChatComment,
  endChat,
  updateChatScreen,
} from 'classicSrc/redux/modules/chat'
import { CHATTING_SCREEN } from 'classicSrc/redux/modules/chat/chat-screen-types'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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
