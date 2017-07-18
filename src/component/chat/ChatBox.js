import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonSecondary } from 'component/button/ButtonSecondary';
import { Field } from 'component/field/Field';
import { i18n } from 'service/i18n';

import { locals as styles } from './ChatBox.sass';

export class ChatBox extends Component {
  static propTypes = {
    currentMessage: PropTypes.string,
    sendMsg: PropTypes.func.isRequired,
    updateCurrentMsg: PropTypes.func.isRequired
  };

  static defaultProps = {
    currentMessage: ''
  };

  handleSendClick = () => {
    this.props.sendMsg(this.props.currentMessage);
    this.props.updateCurrentMsg('');
  }

  handleKeyPress = (e) => {
    if(e.key == 'Enter') {
      this.handleSendClick();
      e.preventDefault();
    }
  }

  handleChange = (e) => {
    const { value } = e.target;

    this.props.updateCurrentMsg(value);
  }

  chatBoxTextarea = () => {
    const placeholder = i18n.t('embeddable_framework.chat.chatBox.placeholder.typeMessageHere', {
      fallback: 'Type a message here…'
    });

    return <textarea
      onKeyPress={this.handleKeyPress}
      placeholder={placeholder}
      rows="3" />
  }

  render = () => {
    return (
      <div>
        <div className={styles.input}>
          <Field
            input={this.chatBoxTextarea()}
            onChange={this.handleChange}
            name='chatBox'
            value={this.props.currentMessage} />
        </div>
      </div>
    );
  }
}

