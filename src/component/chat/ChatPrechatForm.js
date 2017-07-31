import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Field } from 'component/field/Field';
import { Button } from 'component/button/Button';

import { i18n } from 'service/i18n';

import { locals as styles } from './ChatBox.sass';

export class ChatPrechatForm extends Component {
  static propTypes = {
    onFormCompleted: PropTypes.func
  };

  static defaultProps = {
    onFormCompleted: () => {}
  };

  handleButtonClick = (e) => {
    e.preventDefault();

    this.props.onFormCompleted();
  }

  render = () => {
    return (
      <form
        noValidate={true}
        className={`${styles.form}`}>
        <Field
          placeholder={i18n.t('embeddable_framework.common.textLabel.name', { fallback: 'Your name' })}
          required={true}
          name='name' />
        <Field
          placeholder={i18n.t('embeddable_framework.common.textLabel.email', { fallback: 'Email' })}
          required={true}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
          name='email' />
        <Field
          placeholder={i18n.t('embeddable_framework.common.textLabel.phoneNumber', { fallback: 'Phone Number' })}
          required={true}
          type='number'
          name='phone' />
        <Field
          placeholder={i18n.t('embeddable_framework.common.textLabel.message', { fallback: 'Message' })}
          required={true}
          input={<textarea rows='3' />}
          name='message' />
        <Button
          label={i18n.t('embeddable_framework.chat.preChat.online.button.startChat')}
          disabled={!this.state.valid}
          type='submit' />
      </form>
    );
  }
}
