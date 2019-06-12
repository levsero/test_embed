import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { FeedbackForm } from 'component/chat/rating/FeedbackForm';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import {
  updateChatScreen,
  sendChatRating,
  endChat,
  sendChatComment
} from 'src/redux/modules/chat';
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import {
  getPostchatFormSettings,
  getIsChatting,
  getChatRating
} from 'src/redux/modules/chat/chat-selectors';
import {
  getCurrentConcierges,
  getChatTitle,
  getHideZendeskLogo
} from 'src/redux/modules/selectors';
import { locals as styles } from './RatingScreen.scss';

const mapStateToProps = (state) => {
  return {
    postChatFormSettings: getPostchatFormSettings(state),
    isChatting: getIsChatting(state),
    concierges: getCurrentConcierges(state),
    rating: getChatRating(state),
    title: getChatTitle(state),
    hideZendeskLogo: getHideZendeskLogo(state)
  };
};

class RatingScreen extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    concierges: PropTypes.array.isRequired,
    hideZendeskLogo: PropTypes.bool.isRequired,
    endChatFromFeedbackForm: PropTypes.bool,
    postChatFormSettings: PropTypes.object.isRequired,
    rating: PropTypes.object.isRequired,
    onRatingButtonClick: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    endChat: PropTypes.func.isRequired,
    sendChatComment: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired,
    fullscreen: PropTypes.bool,
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    isMobile: false,
    fullscreen: false,
    endChatFromFeedbackForm: false,
    sendChatRating: () => {},
    postChatFormSettings: {},
    onRatingButtonClick: () => {}
  };

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={`${styles.zendeskLogo}`}
        fullscreen={false}
      /> : null;
  }

  skipClick = () => {
    if (this.props.endChatFromFeedbackForm) this.props.endChat();

    this.props.updateChatScreen(CHATTING_SCREEN);
    this.props.onRatingButtonClick();
  }

  sendClick = (newRating, text) => {
    if (newRating !== this.props.rating.value) this.props.sendChatRating(newRating);
    if (text) this.props.sendChatComment(text);
    if (this.props.endChatFromFeedbackForm) this.props.endChat();

    this.props.updateChatScreen(CHATTING_SCREEN);
    this.props.onRatingButtonClick();
  };

  renderChatHeader = () => {
    return (
      <ChatHeader
        showRating={false}
        rating={this.props.rating.value}
        updateRating={this.props.sendChatRating}
        concierges={this.props.concierges} />
    );
  }

  render = () => {
    const { isMobile, fullscreen } = this.props;
    const { message } = this.props.postChatFormSettings;
    const logoFooterClasses = classNames({
      [styles.logoFooter]: !this.props.hideZendeskLogo
    });
    const cancelButtonTextKey = this.props.isChatting
      ? 'embeddable_framework.common.button.cancel'
      : 'embeddable_framework.chat.postChat.rating.button.skip';

    return (
      <div>
        <ScrollContainer
          headerContent={this.renderChatHeader()}
          title={this.props.title}
          containerClasses={styles.scrollContainerContent}
          footerClasses={logoFooterClasses}
          fullscreen={fullscreen}
          isMobile={isMobile}>
          <FeedbackForm
            feedbackMessage={message}
            rating={this.props.rating}
            skipClickFn={this.skipClick}
            sendClickFn={this.sendClick}
            cancelButtonText={i18n.t(cancelButtonTextKey)} />
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    );
  }
}

const actionCreators = {
  updateChatScreen,
  sendChatRating,
  sendChatComment,
  endChat
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(RatingScreen);
