import React, { Component, PropTypes } from 'react';
import { locals as styles } from './MessageBubble.sass';

export class MessageBubble extends Component {
  render() {
    const style = {
      color: this.props.color,
      backgroundColor: this.props.backgroundColor
    };

    return (
      <div
        className={styles.messageBubble}
        style={style}>
        {this.props.message}
      </div>
    );
  }
}

MessageBubble.propTypes = {
  message: PropTypes.string,
  backgroundColor: PropTypes.string,
  color: PropTypes.string
};

MessageBubble.defaultProps = {
  message: '',
  backgroundColor: '#78A300',
  color: 'white'
};
