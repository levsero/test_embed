import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { locals as styles } from './MessageBubble.sass';

export class MessageBubble extends Component {

  render() {
    const className = `${styles.messageBubble}`;
    const divStyle = {
      color: this.props.color,
      backgroundColor: this.props.backgroundColor
    };

    return (
      <div
        className={className}
        style={divStyle}>
        Thanks. So it seems like you are yet to validate your email address. Do you recall receiving an email from us asking for you to do that, fam? 😀
        {this.props.message}
      </div>
    );
  }
}

MessageBubble.propTypes = {
  message: PropTypes.string,
  backgroundColor: PropTypes.string,
  color: PropTypes.string
}

MessageBubble.defaultProps = {
  message: '',
  backgroundColor: 'hotpink',
  color: 'white'
}
