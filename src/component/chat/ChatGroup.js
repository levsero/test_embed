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

  renderChatMessage = (data, index) => {
    const { isAgent, children } = this.props;
    const isLastIndex = index === (children.length - 1);
    const showAvatar = (isLastIndex && isAgent);
    const avatarPath = (isLastIndex && isAgent) ? this.props.avatarPath : '';
    const name = (index === 0 && isAgent) ? data.display_name : '';

    return (
      <ChatMessage
        key={index}
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
