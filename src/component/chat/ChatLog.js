import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ChatMessage } from 'component/chat/ChatMessage';

export class ChatLog extends Component {
  static propTypes = {
    agents: PropTypes.object.isRequired,
    chats: PropTypes.object.isRequired,
    userColor: PropTypes.string.isRequired
  };

  renderChatMessage = (data, key) => {
    return (
      <ChatMessage
        userColor={this.props.userColor}
        key={key}
        name={data.display_name}
        message={data.msg}
        showAvatar={data.showAvatar}
        avatarPath={data.avatarPath}
        nick={data.nick} />);
  }

  keepFirstName = (chatList) => {
    if (chatList.length > 1) {
      _.each(chatList, (chat, key) => {
        const range = key + 1;

        if (chat.nick !== 'visitor' && range < chatList.length) {
          const nextChat = chatList[range];

        // Iterate and compare the first two sets in the collection and drop the next display_name
          if (chat.nick === nextChat.nick) nextChat.display_name = ''; // eslint-disable-line camelcase
        }
      });
    }

    return chatList;
  }

  applyAvatarFlag = (chatList) => {
    const { agents } = this.props;

    _.each(chatList, (chat, key) => {
      const range = key + 1;

      if (chat.nick !== 'visitor' && range <= chatList.length) {
        const nextChat = chatList[range];

        // If it's the last element OR
        // The current chat is not the same as as the next then we know it is the last chat group for that agent
        if (range === chatList.length || chat.nick !== nextChat.nick) {
          chat.showAvatar = true;
          chat.avatarPath = agents[chat.nick].avatar_path || '';
        } else {
          chat.showAvatar = false;
        }
      }
    });

    return chatList;
  }

  render() {
    const { chats } = this.props;

    if (chats.size <= 0) return null;

    let chatList = _.chain([...chats.values()])
                    .filter((m) => m.type === 'chat.msg')
                    .each(this.keepFirstName2)
                    .value();

    // Possible performance issue in the future with concurrent chats
    // due to multiple collection op per chat message. May slow down
    // with large chat logs.
    chatList = this.keepFirstName(chatList);
    chatList = this.applyAvatarFlag(chatList);

    return <span>{_.map(chatList, this.renderChatMessage)}</span>;
  }
}
