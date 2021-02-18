import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FeedbackForm from 'embeds/chat/components/FeedbackForm'
import ChatHeader from 'embeds/chat/components/ChatHeader'
import { getIsChatting, getChatRating } from 'src/redux/modules/chat/chat-selectors'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import { sendChatRating, sendChatComment, endChat, updateChatScreen } from 'src/redux/modules/chat'
import ChatWidgetHeader from 'embeds/chat/components/ChatWidgetHeader'
import { Widget, Main, Footer } from 'components/Widget'
import useTranslate from 'src/hooks/useTranslate'

const mapStateToProps = (state) => {
  return {
    isChatting: getIsChatting(state),
    rating: getChatRating(state),
  }
}

const ChatRatingPage = ({ rating, sendChatRating, sendChatComment, updateChatScreen }) => {
  const translate = useTranslate()

  const handleCancel = () => {
    updateChatScreen(CHATTING_SCREEN)
  }

  const handleSubmit = (newRating, text) => {
    sendChatRating(newRating)
    if (text) sendChatComment(text)
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
  endChat,
  updateChatScreen,
}

ChatRatingPage.propTypes = {
  rating: PropTypes.object.isRequired,
  sendChatRating: PropTypes.func.isRequired,
  sendChatComment: PropTypes.func.isRequired,
  updateChatScreen: PropTypes.func.isRequired,
}

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  ChatRatingPage
)

export { connectedComponent as default, ChatRatingPage as Component }
