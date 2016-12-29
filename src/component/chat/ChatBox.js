import React, { Component, PropTypes } from 'react';

export class ChatBox extends Component {
  handleSendClick = () => {
    this.props.sendMsg(this.props.chat.currentMessage);
    this.props.updateCurrentMsg('');
  }

  handleMsgChange = (e) => {
    const value = e.target.value;

    this.props.updateCurrentMsg(value);
  }

  render = () => {
    return (
      <div>
        <h2>Chat stuff</h2>
        <div>
          <input type='text' onChange={this.handleMsgChange} value={this.props.chat.currentMessage} />
          <button onClick={this.handleSendClick}>Send</button>
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

