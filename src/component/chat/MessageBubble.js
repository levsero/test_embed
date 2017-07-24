import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './MessageBubble.sass';

export class MessageBubble extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string,
    className: PropTypes.string,
    color: PropTypes.string,
    message: PropTypes.string
  };

  static defaultProps = {
    backgroundColor: '#30AABC',
    className: '',
    color: '#FFFFFF',
    message: ''
  };

  render = () => {
    const style = {
      color: this.props.color,
      backgroundColor: this.props.backgroundColor
    };

    return (
      <div
        className={`${styles.messageBubble} ${this.props.className}`}
        style={style}>
        {this.props.message}
      </div>
    );
  }
}
