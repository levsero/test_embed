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
    const lastIndex = chatList.length - 1;
    const previousIndex = lastIndex - 1;

    if (chatList.length > 1) {
      if (chatList[lastIndex].nick === chatList[previousIndex].nick) {
        chatList[lastIndex].display_name = '';
      }
    }

    return chatList;
  }

  applyAvatarFlag = (chatList) => {
    const { agents } = this.props;
    const lastIndex = chatList.length - 1;
    const previousIndex = lastIndex - 1;
    const currentAgent = _.get(chatList, lastIndex, {});
    const previousAgent = _.get(chatList, previousIndex, {});

    const setAgentDetails = (agent, showAvatar, avatarPath) => {
      agent.showAvatar = showAvatar;
      agent.avatarPath = avatarPath || '';
    };

    console.log('applyAvatarFlag');

    if (chatList.length > 1 || lastIndex === 0) {
      console.log('currentAgent = true');
      setAgentDetails(currentAgent, true, agents[currentAgent.nick].avatar_path);

      if (currentAgent.nick === previousAgent.nick) {
        setAgentDetails(previousAgent, false);
      }
    }

    return chatList;
  }

  processChatList = (chatList) => {
    const lastIndex = chatList.length - 1;

    if (lastIndex >= 0 && chatList[lastIndex].nick !== 'visitor') {
      chatList = this.keepFirstName(chatList);
      chatList = this.applyAvatarFlag(chatList);
    }

    return chatList;
  }

  render() {
    const { chats } = this.props;

    if (!chats || chats.size <= 0) return null;

    let chatList = _.chain([...chats.values()])
                    .filter((m) => m.type === 'chat.msg')
                    .value();

    return (
      <span>
        {_.map(this.processChatList(chatList), this.renderChatMessage)}
      </span>
    );
  }
}
