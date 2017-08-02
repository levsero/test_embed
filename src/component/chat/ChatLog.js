import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ChatGroup } from 'component/chat/ChatGroup';

export class ChatLog extends Component {
  static propTypes = {
    agents: PropTypes.object.isRequired,
    chats: PropTypes.object.isRequired
  };

  constructor() {
    super();

    // The following instance variables are purposely not assigned as state.
    // This is due to us wanting to update the values without triggering a re-render.
    this.previousUser = null;
    this.groupCount = 0;
  }

  renderChatGroup = (chatGroup, key) => {
    const firstUserNick = _.get(chatGroup, '0.nick', '');
    const isAgent = firstUserNick !== 'visitor';
    const avatarPath = _.get(this.props.agents, `${firstUserNick}.avatar_path`, '');

    return (
      <ChatGroup
        key={key}
        isAgent={isAgent}
        messages={chatGroup}
        avatarPath={avatarPath} />);
  }

  processChatGroup = (chat) => {
    if (chat.nick !== this.previousUser) {
      this.previousUser = chat.nick;
      this.groupCount += 1;
    }

    return this.groupCount;
  }

  render() {
    const { chats } = this.props;
    const chatGroups = _.chain([...chats.values()])
                        .filter((m) => m.type === 'chat.msg')
                        .groupBy(this.processChatGroup)
                        .map(this.renderChatGroup)
                        .value();

    return (
      <div>{chatGroups}</div>
    );
  }
}
