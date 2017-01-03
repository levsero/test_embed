import React, { Component, PropTypes } from 'react';

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

  handleChange = (e) => {
    const value = e.target.value;

    this.props.updateCurrentMsg(value);
  }

  render = () => {
    return (
      <div>
        <div className={styles.input}>
          <Field
            onChange={this.handleChange}
            name='chatBox'
            value={this.props.currentMessage} />
        </div>
        <ButtonSecondary
          onClick={this.handleSendClick}
          className={styles.button}
          label={i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send')} />
      </div>
    );
  }
}

