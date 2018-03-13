import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { locals as styles } from './MessageBubble.scss';
import { MessageOptions }  from 'component/shared/MessageOptions';

export class MessageBubble extends Component {
  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    options: PropTypes.array,
    handleSendMsg: PropTypes.func
  };

  static defaultProps = {
    options: []
  }

  renderOptions = () => {
    const { options } = this.props;

    if (!options.length) return;

    const optionItems = options.map((option, index) => {
      const args = _.isFunction(this.props.handleSendMsg) ? { onClick: () => this.props.handleSendMsg(option)} : {};

      return (
        <a key={index} {...args}>
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
          {this.props.message}
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}
