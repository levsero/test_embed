import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Widget, Main, Footer } from 'src/components/Widget'
import ChatHeader from 'src/embeds/chat/components/ChatHeader'
import ChatWidgetHeader from 'src/embeds/chat/components/ChatWidgetHeader'
import FeedbackForm from 'src/embeds/chat/components/FeedbackForm'
import ChatPropTypes from 'src/embeds/chat/utils/ChatPropTypes'
import useTranslate from 'src/hooks/useTranslate'
import { sendChatRating, sendChatComment, endChat, updateChatScreen } from 'src/redux/modules/chat'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import { getIsChatting, getChatRating } from 'src/redux/modules/chat/chat-selectors'

const mapStateToProps = (state) => {
  return {
    isChatting: getIsChatting(state),
    rating: getChatRating(state),
  }
}

const PostChatPage = ({ rating, sendChatRating, sendChatComment, endChat, updateChatScreen }) => {
  const translate = useTranslate()

  const handleSkip = () => {
    endChat()
    updateChatScreen(CHATTING_SCREEN)
  }

  const handleSubmit = (newRating, text) => {
    sendChatRating(newRating)
    if (text) sendChatComment(text)
    endChat()
    updateChatScreen(CHATTING_SCREEN)
  }

  return (
    <Widget>
      <ChatWidgetHeader />
      <ChatHeader />

      <Main>
        <FeedbackForm
          rating={rating}
          handleSecondaryButtonClick={handleSkip}
          submitForm={handleSubmit}
          secondaryButtonText={translate('embeddable_framework.chat.postChat.rating.button.skip')}
        />
      </Main>
      <Footer />
    </Widget>
  )
}

const actionCreators = {
  sendChatRating,
  sendChatComment,
  endChat,
  updateChatScreen,
}

PostChatPage.propTypes = {
  rating: ChatPropTypes.chatRating.isRequired,
  sendChatRating: PropTypes.func.isRequired,
  sendChatComment: PropTypes.func.isRequired,
  endChat: PropTypes.func.isRequired,
  updateChatScreen: PropTypes.func.isRequired,
}

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  PostChatPage
)

export { connectedComponent as default, PostChatPage as Component }
