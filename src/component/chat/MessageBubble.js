import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './MessageBubble.sass';

export class MessageBubble extends Component {
  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string
  };

  static defaultProps = {
    className: '',
    message: ''
  };

  render = () => {
    return (
      <div className={`${styles.messageBubble} ${this.props.className}`}>
        {this.props.message}
      </div>
    );
  }
}
