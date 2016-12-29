import React, { Component, PropTypes } from 'react';

import { locals as styles } from './ChatBox.sass';

export class ChatBox extends Component {
  handleSendClick = () => {
    this.props.sendMsg(this.props.chat.currentMessage);
    this.props.updateCurrentMsg('');
  }

  handleMsgChange = (e) => {
    const value = e.target.value;

    if (e.keyCode === 13) {
      this.handleSendClick();
    }

    this.props.updateCurrentMsg(value);
  }

  render = () => {
    return (
      <div>
        <div className={styles.container}>
          <input type='text' onChange={this.handleMsgChange} className={styles.input} value={this.props.chat.currentMessage} />
          <button onClick={this.handleSendClick} className={styles.button}>Send</button>
        </div>
      </div>
    );
  }
}

ChatBox.propTypes = {
  chat: PropTypes.object.isRequired,
  sendMsg: PropTypes.func.isRequired,
  updateCurrentMsg: PropTypes.func.isRequired
};

