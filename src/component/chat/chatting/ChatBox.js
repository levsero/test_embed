import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Label, Textarea } from '@zendeskgarden/react-textfields';

import { i18n } from 'service/i18n';
import { keyCodes } from 'utility/keyboard';

import { locals as styles } from './ChatBox.scss';
import classNames from 'classnames';

export class ChatBox extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    currentMessage: PropTypes.string,
    sendChat: PropTypes.func.isRequired,
    handleChatBoxChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    currentMessage: ''
  };

  handleKeyDown = (e) => {
    if (e.keyCode === keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault();
      this.props.sendChat();
    }
  }

  handleChange = (e) => {
    const { value } = e.target;

    this.props.handleChatBoxChange(value);
  }

  render = () => {
    const placeholder = i18n.t('embeddable_framework.chat.chatBox.placeholder.typeMessageHere');
    const inputClasses = classNames(
      styles.input,
      { [styles.inputMobile]: this.props.isMobile,
        [styles.fieldMobile]: this.props.isMobile }
    );

    return (
      <div className={styles.container}>
        <TextField className={styles.textField}>
          <Label className={styles.label}>
            {placeholder}
          </Label>
          <Textarea
            value={this.props.currentMessage}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            className={inputClasses}
            placeholder={placeholder}
            name='chatBox'
            rows={this.props.isMobile ? 1 : 3} />
        </TextField>
      </div>
    );
  }
}
