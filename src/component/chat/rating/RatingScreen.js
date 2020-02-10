import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FeedbackForm } from 'component/chat/rating/FeedbackForm'
import ChatHeader from 'embeds/chat/components/ChatHeader'
import { i18n } from 'service/i18n'
import { updateChatScreen, sendChatRating, endChat, sendChatComment } from 'src/redux/modules/chat'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import {
  getPostchatFormSettings,
  getIsChatting,
  getChatRating
} from 'src/redux/modules/chat/chat-selectors'
import { getCurrentConcierges, getChatTitle } from 'src/redux/modules/selectors'
import ChatWidgetHeader from 'embeds/chat/components/ChatWidgetHeader'
import { Widget, Main, Footer } from 'components/Widget'

const mapStateToProps = state => {
  return {
    postChatFormSettings: getPostchatFormSettings(state),
    isChatting: getIsChatting(state),
    concierges: getCurrentConcierges(state),
    rating: getChatRating(state),
    title: getChatTitle(state)
  }
}

class RatingScreen extends Component {
  static propTypes = {
    concierges: PropTypes.array.isRequired,
    endChatFromFeedbackForm: PropTypes.bool,
    postChatFormSettings: PropTypes.object.isRequired,
    rating: PropTypes.object.isRequired,
    onRatingButtonClick: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    endChat: PropTypes.func.isRequired,
    sendChatComment: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired
  }

  static defaultProps = {
    isMobile: false,
    fullscreen: false,
    endChatFromFeedbackForm: false,
    sendChatRating: () => {},
    postChatFormSettings: {},
    onRatingButtonClick: () => {}
  }

  skipClick = () => {
    if (this.props.endChatFromFeedbackForm) this.props.endChat()

    this.props.updateChatScreen(CHATTING_SCREEN)
    this.props.onRatingButtonClick()
  }

  sendClick = (newRating, text) => {
    this.props.sendChatRating(newRating)
    if (text) this.props.sendChatComment(text)
    if (this.props.endChatFromFeedbackForm) this.props.endChat()

    this.props.updateChatScreen(CHATTING_SCREEN)
    this.props.onRatingButtonClick()
  }

  renderChatHeader = () => {
    return (
      <ChatHeader
        showRating={false}
        rating={this.props.rating.value}
        updateRating={this.props.sendChatRating}
        concierges={this.props.concierges}
      />
    )
  }

  render = () => {
    const { message } = this.props.postChatFormSettings
    const cancelButtonTextKey = this.props.isChatting
      ? 'embeddable_framework.common.button.cancel'
      : 'embeddable_framework.chat.postChat.rating.button.skip'

    return (
      <Widget>
        <ChatWidgetHeader />
        {this.renderChatHeader()}
        <Main>
          <FeedbackForm
            feedbackMessage={message}
            rating={this.props.rating}
            skipClickFn={this.skipClick}
            sendClickFn={this.sendClick}
            cancelButtonText={i18n.t(cancelButtonTextKey)}
          />
        </Main>
        <Footer />
      </Widget>
    )
  }
}

const actionCreators = {
  updateChatScreen,
  sendChatRating,
  sendChatComment,
  endChat
}

export default connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(RatingScreen)
