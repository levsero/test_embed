import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ChatGroup } from 'component/chat/ChatGroup';
import { ChatEventMessage } from 'component/chat/ChatEventMessage';
// TODO: move constants out of chat-selectors and into a more sensible location
import { CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'src/redux/modules/chat/chat-selectors';

export class ChatLog extends Component {
  static propTypes = {
    chatLog: PropTypes.object.isRequired,
    agents: PropTypes.object
  };

  renderChatLog(chatLog, agents) {
    const chatLogEl = _.map(chatLog, (chatLogItem, timestamp) => {
      // message groups and events are both returned as arrays; we can determine the type of the entire timestamped item 'group' by reading the type value of the first entry
      const chatLogItemType = _.get(chatLogItem, '0.type');

      if (_.includes(CHAT_MESSAGE_EVENTS, chatLogItemType)) {
        const chatGroup = chatLogItem;
        const groupNick = _.get(chatGroup, '0.nick');
        const isAgent = groupNick !== 'visitor';
        const avatarPath = _.get(agents, `${groupNick}.avatar_path`);

        return (
          <ChatGroup
            key={timestamp}
            isAgent={isAgent}
            messages={chatGroup}
            avatarPath={avatarPath} />
        );
      } else if (_.includes(CHAT_SYSTEM_EVENTS, chatLogItemType)) {
        const event = chatLogItem[0];

        return (
          <ChatEventMessage
            key={timestamp}
            event={event} />
        );
      }
    });

    return chatLogEl.length ? chatLogEl : null;
  }

  render() {
    const { chatLog, agents } = this.props;

    return (
      <div>{this.renderChatLog(chatLog, agents)}</div>
    );
  }
}
