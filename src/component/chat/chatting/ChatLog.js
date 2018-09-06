import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatLog.scss';

import { ChatGroup } from 'component/chat/chatting/ChatGroup';
import { EventMessage } from 'component/chat/chatting/EventMessage';
import { QuickReply, QuickReplies } from 'component/shared/QuickReplies';
import { Button } from '@zendeskgarden/react-buttons';
import { CHAT_MESSAGE_EVENTS, CHAT_STRUCTURED_CONTENT, CHAT_SYSTEM_EVENTS } from 'constants/chat';

export class ChatLog extends Component {
  static propTypes = {
    chatLog: PropTypes.object.isRequired,
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
    conciergeAvatar: PropTypes.string
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
      agents,
      chatCommentLeft,
      goToFeedbackScreen,
      showAvatar,
      handleSendMsg,
      onImageLoad,
      showUpdateInfo,
      updateInfoOnClick,
      socialLogin,
      conciergeAvatar
    } = this.props;

    const chatLogs = _.map(chatLog, (chatLogItem, timestamp) => {
      // message groups and events are both returned as arrays; we can determine the type of the entire timestamped item 'group' by reading the type value of the first entry
      const chatLogItemType = _.get(chatLogItem, '0.type');

      if (_.includes(CHAT_MESSAGE_EVENTS, chatLogItemType)) {
        const chatGroup = chatLogItem;
        const groupNick = _.get(chatGroup, '0.nick', 'visitor');
        const isAgent = groupNick.indexOf('agent:') > -1;
        const avatarPath = _.get(agents, `${groupNick}.avatar_path`) || conciergeAvatar;
        const shouldRenderUpdateInfo = showUpdateInfo && chatGroup.isFirstVisitorMessage;

        return (
          <ChatGroup
            key={timestamp}
            isAgent={isAgent}
            messages={chatGroup}
            avatarPath={avatarPath}
            showAvatar={showAvatar}
            onImageLoad={onImageLoad}
            handleSendMsg={handleSendMsg}
            socialLogin={socialLogin}
            chatLogCreatedAt={this.createdTimestamp}>
            {this.renderUpdateInfo(shouldRenderUpdateInfo, updateInfoOnClick)}
          </ChatGroup>
        );
      } else if (_.includes(CHAT_SYSTEM_EVENTS, chatLogItemType)) {
        const event = chatLogItem[0];

        return (
          <EventMessage
            event={event}
            key={timestamp}
            chatLogCreatedAt={this.createdTimestamp}
          >
            {this.renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreen)}
          </EventMessage>
        );
      } else if (_.includes(CHAT_STRUCTURED_CONTENT, chatLogItemType)) {
        return this.renderStructuredMessage(chatLogItem[0]);
      }
    });

    return chatLogs;
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

  renderStructuredMessage(chatLogItem) {
    const { type, timestamp, hidden, ...props } = chatLogItem;

    if (hidden) {
      return null;
    } else if (type === CHAT_STRUCTURED_CONTENT.CHAT_QUICK_REPLIES) {
      return (
        <QuickReplies key={timestamp}>
          {props.items.map((item, idx) => {
            const { action, text } = item;
            const actionFn = () => this.props.handleSendMsg(action.value);

            return <QuickReply key={idx} label={text} onClick={actionFn} />;
          })}
        </QuickReplies>
      );
    }
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
