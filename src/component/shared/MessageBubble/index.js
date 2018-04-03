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
    const { handleSendMsg, options } = this.props;

    return options.length && (
      <MessageOptions
        isMessageBubbleLinked={true}
        onOptionClick={handleSendMsg}
        optionItems={options} />
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
