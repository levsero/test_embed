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

  componentDidMount = () => {
    this.handleFormChange();
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

    // The `checkValidity` is not available on the form dom element created
    // by jsdom during unit testing. This sanity check allows our unit tests to pass.
    // See this Github issue: https://github.com/tmpvar/jsdom/issues/544
    const valid = !!(this.form.checkValidity && this.form.checkValidity());

    this.setState({
      valid,
      formState: values
    });
  }

  renderGreetingMessage = () => {
    const { greetingMessage } = this.props;

    return greetingMessage !== ''
         ? <div className={styles.greetingMessage}>{greetingMessage}</div>
         : null;
  }

  renderNameField = () => {
    const nameData = this.props.form.name;

    return (
      <Field
        label={i18n.t('embeddable_framework.common.textLabel.name', { fallback: 'Your name' })}
        required={nameData.required}
        value={this.state.formState.name}
        name={nameData.name} />
    );
  }

  renderEmailField = () => {
    const emailData = this.props.form.email;

    return (
      <Field
        label={i18n.t('embeddable_framework.common.textLabel.email', { fallback: 'Email' })}
        required={emailData.required}
        value={this.state.formState.email}
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
        name={emailData.name} />
    );
  }

  renderPhoneField = () => {
    const phoneData = this.props.form.phone;

    return !phoneData.hidden
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

    return (
      <Field
        placeholder={i18n.t('embeddable_framework.common.textLabel.message', { fallback: 'Message' })}
        required={messageData.required}
        value={this.state.formState.message}
        input={<textarea rows='3' />}
        name={messageData.name} />
    );
  }

  render = () => {
    return (
      <form
        noValidate={true}
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        ref={(el) => { this.form = el; }}
        className={`${styles.form}`}>
        {this.renderGreetingMessage()}
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
