import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { ChatFeedbackForm } from 'component/chat/ChatFeedbackForm';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import {
  updateChatScreen,
  sendChatRating,
  endChat,
  sendChatComment } from 'src/redux/modules/chat';
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import {
  getPostchatFormSettings,
  getIsChatting,
  getCurrentConcierges,
  getChatRating } from 'src/redux/modules/chat/chat-selectors';
import { locals as styles } from './RatingScreen.scss';

const mapStateToProps = (state) => {
  return {
    postChatFormSettings: getPostchatFormSettings(state),
    isChatting: getIsChatting(state),
    concierges: getCurrentConcierges(state),
    rating: getChatRating(state)
  };
};

class RatingScreen extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    concierges: PropTypes.array.isRequired,
    hideZendeskLogo: PropTypes.bool,
    endChatFromFeedbackForm: PropTypes.bool,
    postChatFormSettings: PropTypes.object.isRequired,
    rating: PropTypes.object.isRequired,
    onRatingButtonClick: PropTypes.func.isRequired,
    isChatting: PropTypes.bool.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    endChat: PropTypes.func.isRequired,
    sendChatComment: PropTypes.func.isRequired,
    sendChatRating: PropTypes.func.isRequired
  };

  static defaultProps = {
    isMobile: false,
    endChatFromFeedbackForm: false,
    sendChatRating: () => {},
    postChatFormSettings: {},
    hideZendeskLogo: false,
    onRatingButtonClick: () => {}
  };

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={`${styles.zendeskLogo}`}
        rtl={i18n.isRTL()}
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
    const { isMobile } = this.props;
    const { message } = this.props.postChatFormSettings;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: isMobile }
    );
    const logoFooterClasses = classNames({
      [styles.logoFooter]: !this.props.hideZendeskLogo
    });
    const cancelButtonTextKey = this.props.isChatting
      ? 'embeddable_framework.common.button.cancel'
      : 'embeddable_framework.chat.postChat.rating.button.skip';

    return (
      <ScrollContainer
        headerContent={this.renderChatHeader()}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        footerClasses={logoFooterClasses}
        footerContent={this.renderZendeskLogo()}
        fullscreen={isMobile}>
        <ChatFeedbackForm
          feedbackMessage={message}
          rating={this.props.rating}
          skipClickFn={this.skipClick}
          sendClickFn={this.sendClick}
          cancelButtonText={i18n.t(cancelButtonTextKey)} />
      </ScrollContainer>
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
