import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Field } from 'component/field/Field';
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

  chatBoxTextarea = () => {
    const rows = this.props.isMobile ? '1' : '2';

    return (
      <textarea
        onKeyDown={this.handleKeyDown}
        rows={rows} />);
  }

  render = () => {
    const placeholder = i18n.t('embeddable_framework.chat.chatBox.placeholder.typeMessageHere');
    const fieldClasses = classNames(
      { [styles.fieldMobile]: this.props.isMobile }
    );
    const inputClasses = classNames(
      styles.input,
      { [styles.inputMobile]: this.props.isMobile }
    );

    return (
      <div className={styles.container}>
        <Field
          labelClasses={styles.label}
          fieldClasses={fieldClasses}
          inputClasses={inputClasses}
          placeholder={placeholder}
          input={this.chatBoxTextarea()}
          onChange={this.handleChange}
          name='chatBox'
          value={this.props.currentMessage} />
      </div>
    );
  }
}
