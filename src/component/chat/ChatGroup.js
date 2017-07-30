import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ChatMessage } from 'component/chat/ChatMessage';

export class ChatGroup extends Component {
  static propTypes = {
    children: PropTypes.array,
    isAgent: PropTypes.bool.isRequired,
    avatarPath: PropTypes.string
  };

  static defaultProps = {
    children: [],
    avatarPath: ''
  };

  renderChatMessage = (data, key) => {
    const { isAgent, children } = this.props;
    const isLastIndex = children.length === (key + 1);
    const showAvatar = isLastIndex && isAgent ? true : false;
    const avatarPath = isLastIndex && isAgent ? this.props.avatarPath : '';
    const name = (key === 0 && isAgent) ? data.display_name : '';

    return (
      <ChatMessage
        key={key}
        name={name}
        isAgent={isAgent}
        message={data.msg}
        showAvatar={showAvatar}
        avatarPath={avatarPath} />);
  }

  render() {
    return (
      <div>{_.map(this.props.children, this.renderChatMessage)}</div>
    );
  }
}
