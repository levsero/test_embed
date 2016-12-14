import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { bindMethods } from 'utility/utils';
import { sendMsg, updateCurrentMsg } from 'src/redux/actions/chat';

const mapStateToProps = (state) => {
  return { chat: state.chat };
};

class ChatBox extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, ChatBox.prototype);
  }

  handleSendClick() {
    this.props.sendMsg(this.props.chat.currentMessage);
    this.props.updateCurrentMsg('');
  }

  handleMsgChange(e) {
    const value = e.target.value;

    this.props.updateCurrentMsg(value);
  }

  render() {
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

export default connect(mapStateToProps, { sendMsg, updateCurrentMsg }, null, { withRef: true })(ChatBox);
