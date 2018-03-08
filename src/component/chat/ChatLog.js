import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatLog.scss';

import { ChatGroup } from 'component/chat/ChatGroup';
import { ChatEventMessage } from 'component/chat/ChatEventMessage';
import { Button } from 'component/button/Button';
import { CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat';

export class ChatLog extends Component {
  static propTypes = {
    chatLog: PropTypes.object.isRequired,
    agents: PropTypes.object,
    chatCommentLeft: PropTypes.bool.isRequired,
    goToFeedbackScreen: PropTypes.func.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    sendMsgFn: PropTypes.func
  };

  static defaultProps = {
    sendMsgFn: () => {}
  };

  renderChatLog(chatLog, agents, chatCommentLeft, goToFeedbackScreen, showAvatar, sendMsgFn) {
    const chatLogEl = _.map(chatLog, (chatLogItem, timestamp) => {
      // message groups and events are both returned as arrays; we can determine the type of the entire timestamped item 'group' by reading the type value of the first entry
      const chatLogItemType = _.get(chatLogItem, '0.type');

      if (_.includes(CHAT_MESSAGE_EVENTS, chatLogItemType)) {
        const chatGroup = chatLogItem;
        const groupNick = _.get(chatGroup, '0.nick', 'visitor');
        const isAgent = groupNick.indexOf('agent:') > -1;
        const avatarPath = _.get(agents, `${groupNick}.avatar_path`);

        return (
          <ChatGroup
            key={timestamp}
            isAgent={isAgent}
            messages={chatGroup}
            avatarPath={avatarPath}
            showAvatar={showAvatar}
            sendMsgFn={sendMsgFn} />
        );
      } else if (_.includes(CHAT_SYSTEM_EVENTS, chatLogItemType)) {
        const event = chatLogItem[0];

        return (
          <ChatEventMessage event={event} key={timestamp}>
            {this.renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreen)}
          </ChatEventMessage>
        );
      }
    });

    return chatLogEl.length ? chatLogEl : null;
  }

  renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreen) {
    const acceptedEventTypes = ['chat.rating', 'chat.request.rating'];
    const validEventType = _.includes(acceptedEventTypes, event.type);
    const isRatingEvent = event.type === 'chat.rating';
    const showButtonForRating = event.isLastRating && event.new_rating && !chatCommentLeft;

    if (!validEventType || (isRatingEvent && !showButtonForRating)) return;

    const labelKey = (event.type === 'chat.rating')
                   ? 'embeddable_framework.chat.chatLog.button.leaveComment'
                   : 'embeddable_framework.chat.chatLog.button.rateChat';

    return (
      <Button
        primary={false}
        label={i18n.t(labelKey)}
        className={styles.requestRatingButton}
        onClick={goToFeedbackScreen}
      />
    );
  }

  render() {
    const { chatLog, agents, chatCommentLeft, goToFeedbackScreen, showAvatar, sendMsgFn } = this.props;

    return this.renderChatLog(chatLog, agents, chatCommentLeft, goToFeedbackScreen, showAvatar, sendMsgFn);
  }
}
