import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Field } from 'component/field/Field';
import { Button } from 'component/button/Button';

import { i18n } from 'service/i18n';

import { locals as styles } from './ChatPrechatForm.sass';

export class ChatPrechatForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    greetingMessage: PropTypes.string,
    visitor: PropTypes.object,
    onFormCompleted: PropTypes.func
  };

  static defaultProps = {
    form: {},
    greetingMessage: '',
    visitor: {},
    onFormCompleted: () => {}
  };

  constructor() {
    super();

    this.state = {
      valid: false,
      formState: {}
    };

    this.form = null;
  }

  componentWillReceiveProps = (props) => {
    if (props.visitor.email) {
      this.setState({
        formState: _.merge({}, props.visitor, this.state.formState)
      });
    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.props.onFormCompleted(this.state.formState);
  }

  handleFormChange = () => {
    const reduceNames = (result, field) => {
      result[field.name] = field.value;

      return result;
    };
    const values = _.chain(this.form.elements)
                    .reject((field) => field.type === 'submit')
                    .reduce(reduceNames, {})
                    .value();

    this.setState({
      valid: this.form.checkValidity(),
      formState: values
    });
  }

  renderNameField = () => {
    const nameData = this.props.form.name;

    return nameData
         ? <Field
            placeholder={i18n.t('embeddable_framework.common.textLabel.name', { fallback: 'Your name' })}
            required={nameData.required}
            value={this.state.formState.name}
            name={nameData.name} />
         : null;
  }

  renderEmailField = () => {
    const emailData = this.props.form.email;

    return emailData
         ? <Field
            placeholder={i18n.t('embeddable_framework.common.textLabel.email', { fallback: 'Email' })}
            required={emailData.required}
            value={this.state.formState.email}
            pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
            name={emailData.name} />
         : null;
  }

  renderPhoneField = () => {
    const phoneData = this.props.form.phone;

    return phoneData
         ? <Field
            placeholder={i18n.t('embeddable_framework.common.textLabel.phoneNumber', { fallback: 'Phone Number' })}
            required={phoneData.required}
            type='number'
            value={this.state.formState.phone}
            name={phoneData.name} />
         : null;
  }

  renderMessageField = () => {
    const messageData = this.props.form.message;

    return messageData
         ? <Field
            placeholder={i18n.t('embeddable_framework.common.textLabel.message', { fallback: 'Message' })}
            required={messageData.required}
            value={this.state.formState.message}
            input={<textarea rows='3' />}
            name={messageData.name} />
         : null;
  }

  render = () => {
    return (
      <form
        noValidate={true}
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        ref={(el) => { this.form = el; }}
        className={`${styles.form}`}>
        {this.renderNameField()}
        {this.renderEmailField()}
        {this.renderPhoneField()}
        {this.renderMessageField()}
        <Button
          label={i18n.t('embeddable_framework.chat.preChat.online.button.startChat')}
          disabled={!this.state.valid}
          className={styles.button}
          type='submit' />
      </form>
    );
  }
}
