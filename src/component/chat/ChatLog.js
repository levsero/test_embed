import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ChatMessage } from 'component/chat/ChatMessage';

export class ChatLog extends Component {
  static propTypes = {
    agents: PropTypes.object.isRequired,
    chats: PropTypes.object.isRequired
  };

  renderChatMessage = (data, key) => {
    const isAgent = (data.nick !== 'visitor');
    const avatarPath = _.get(this.props.agents, `${data.nick}.avatar_path`, '');

    return (
      <ChatMessage
        isAgent={isAgent}
        key={key}
        name={data.display_name}
        message={data.msg}
        showAvatar={isAgent}
        avatarPath={avatarPath} />);
  }

  render() {
    const { chats } = this.props;
    const chatList = _.chain([...chats.values()])
                      .filter((m) => m.type === 'chat.msg')
                      .map(this.renderChatMessage)
                      .value();

    return (
      <div>{chatList}</div>
    );
  }
}
