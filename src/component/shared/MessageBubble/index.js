import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './MessageBubble.scss';
import { MessageOptions }  from 'component/shared/MessageOptions';
import Linkify from 'react-linkify';

export class MessageBubble extends Component {
  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    options: PropTypes.array,
    handleSendMsg: PropTypes.func
  };

  static defaultProps = {
    options: [],
    handleSendMsg: () => {}
  }

  renderOptions = () => {
    const { options } = this.props;

    if (!options.length) return;

    const optionItems = options.map((option, index) => {
      return (
        <a key={index} onClick={() => this.props.handleSendMsg(option)}>
          {option}
        </a>
      );
    });

    return (
      <MessageOptions isMessageBubbleLinked={true} optionItems={optionItems} />
    );
  }

  render() {
    const messageBubbleClasses = this.props.options.length ? styles.messageBubbleWithOptions : styles.messageBubble;

    return (
      <div>
        <div className={`${messageBubbleClasses} ${this.props.className}`}>
          <Linkify properties={{ className: styles.link, target: '_blank' }}>{this.props.message}</Linkify>
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}
