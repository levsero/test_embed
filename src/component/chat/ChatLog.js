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
    const avatarPath = _.get(this.props.agents, `${data.nick}.avatar_path`, '');
    const showAvatar = data.nick === 'visitor' ? false : true;

    return (
      <ChatMessage
        userColor={this.props.userColor}
        key={key}
        name={data.display_name}
        message={data.msg}
        showAvatar={showAvatar}
        avatarPath={avatarPath}
        nick={data.nick} />);
  }

  render() {
    const { chats } = this.props;

    if (!chats || chats.size <= 0) return null;

    const chatList = _.chain([...chats.values()])
                      .filter((m) => m.type === 'chat.msg')
                      .map(this.renderChatMessage)
                      .value();

    return (
      <span>{chatList}</span>
    );
  }
}
