import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatLog.scss';

import ChatGroup from 'component/chat/chatting/ChatGroup';
import EventMessage from 'component/chat/chatting/EventMessage';
import { Button } from '@zendeskgarden/react-buttons';
import {
  getChatLog,
  getFirstVisitorMessage,
  getShowUpdateVisitorDetails
} from 'src/redux/modules/chat/chat-selectors';

const mapStateToProps = (state) => {
  return {
    chatLog: getChatLog(state),
    firstVisitorMessage: getFirstVisitorMessage(state),
    showUpdateInfo: getShowUpdateVisitorDetails(state)
  };
};

export class ChatLog extends Component {
  static propTypes = {
    chatLog: PropTypes.array.isRequired,
    firstVisitorMessage: PropTypes.number,
    lastAgentLeaveEvent: PropTypes.object,
    agents: PropTypes.object,
    chatCommentLeft: PropTypes.bool.isRequired,
    goToFeedbackScreen: PropTypes.func.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    handleSendMsg: PropTypes.func,
    onImageLoad: PropTypes.func,
    showUpdateInfo: PropTypes.bool.isRequired,
    updateInfoOnClick: PropTypes.func,
    socialLogin: PropTypes.object,
    conciergeAvatar: PropTypes.string,
    isMobile: PropTypes.bool.isRequired
  };

  static defaultProps = {
    socialLogin: {}
  };

  constructor(props) {
    super(props);

    this.createdTimestamp = Date.now();
  }

  renderChatLog = () => {
    const {
      chatLog,
      firstVisitorMessage,
      agents,
      chatCommentLeft,
      goToFeedbackScreen,
      showAvatar,
      handleSendMsg,
      onImageLoad,
      showUpdateInfo,
      updateInfoOnClick,
      socialLogin,
      conciergeAvatar,
      isMobile
    } = this.props;

    const chatLogEl = _.map(chatLog, (chatGroup) => {
      const { type, author } = chatGroup;

      if (type === 'message') {
        const timestamp = chatGroup.messages[0];
        const groupNick = author || 'visitor';
        const isAgent = author.indexOf('agent:') > -1;
        const avatarPath = _.get(agents, `${groupNick}.avatar_path`) || conciergeAvatar;
        const shouldRenderUpdateInfo = showUpdateInfo && firstVisitorMessage === timestamp;

        return (
          <ChatGroup
            key={timestamp}
            isAgent={isAgent}
            messageKeys={chatGroup.messages}
            avatarPath={avatarPath}
            showAvatar={showAvatar}
            onImageLoad={onImageLoad}
            handleSendMsg={handleSendMsg}
            socialLogin={socialLogin}
            chatLogCreatedAt={this.createdTimestamp}
            isMobile={isMobile}>
            {this.renderUpdateInfo(shouldRenderUpdateInfo, updateInfoOnClick)}
          </ChatGroup>
        );
      } else if (type === 'event') {
        const event = chatGroup.messages[0];

        return (
          <EventMessage
            eventKey={event}
            key={event}
            chatLogCreatedAt={this.createdTimestamp}
          >
            {this.renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreen)}
          </EventMessage>
        );
      }
    });

    return chatLogEl;
  }

  renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreen) {
    const showButtonForRating = event.isLastRating && event.new_rating && !chatCommentLeft;

    if (!this.validEventType(event, showButtonForRating)) return;

    const labelKey = (event.type === 'chat.rating')
      ? 'embeddable_framework.chat.chatLog.button.leaveComment'
      : 'embeddable_framework.chat.chatLog.button.rateChat';

    return (
      <Button
        className={styles.requestRatingButton}
        onClick={goToFeedbackScreen}>
        {i18n.t(labelKey)}
      </Button>
    );
  }

  validEventType(event, showButton) {
    const isChatRating = event.type === 'chat.rating' && showButton;
    const isChatRequestRating = event.type === 'chat.request.rating';
    const allAgentsHaveLeft = this.allAgentsHaveLeft(event);

    return isChatRating || isChatRequestRating || allAgentsHaveLeft;
  }

  allAgentsHaveLeft(event) {
    const { agents, lastAgentLeaveEvent } = this.props;

    return _.size(agents) < 1 && (lastAgentLeaveEvent && event === lastAgentLeaveEvent);
  }

  renderUpdateInfo(showUpdateInfo, updateInfoOnClick) {
    if (!showUpdateInfo) return;

    return (
      <button onClick={updateInfoOnClick} className={styles.updateInfo}>
        {i18n.t('embeddable_framework.chat.chatLog.login.updateInfo')}
      </button>
    );
  }

  render() {
    const chatLogs = this.renderChatLog();

    return chatLogs.length ? (
      <div>
        {chatLogs}
      </div>
    ) : null;
  }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(ChatLog);
