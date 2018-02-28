import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Field } from 'component/field/Field';
import { i18n } from 'service/i18n';
import { keyCodes } from 'utility/keyboard';

import { locals as styles } from './ChatBox.scss';

export class ChatBox extends Component {
  static propTypes = {
    currentMessage: PropTypes.string,
    sendMsg: PropTypes.func.isRequired,
    handleChatBoxChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    currentMessage: ''
  };

  handleSendClick = () => {
    const { currentMessage, sendMsg, handleChatBoxChange } = this.props;

    if (!_.isEmpty(currentMessage)) {
      sendMsg(currentMessage);
      handleChatBoxChange('');
    }
  }

  handleKeyDown = (e) => {
    if (e.keyCode === keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault();
      this.handleSendClick();
    }
  }

  handleChange = (e) => {
    const { value } = e.target;

    this.props.handleChatBoxChange(value);
  }

  chatBoxTextarea = () => {
    const placeholder = i18n.t('embeddable_framework.chat.chatBox.placeholder.typeMessageHere');

    return (
      <textarea
        onKeyDown={this.handleKeyDown}
        placeholder={placeholder}
        rows='2' />);
  }

  render = () => {
    return (
      <div className={styles.input}>
        <Field
          input={this.chatBoxTextarea()}
          onChange={this.handleChange}
          name='chatBox'
          value={this.props.currentMessage} />
      </div>
    );
  }
}
