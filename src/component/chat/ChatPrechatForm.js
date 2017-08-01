import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Field } from 'component/field/Field';
import { Button } from 'component/button/Button';

import { i18n } from 'service/i18n';

import { locals as styles } from './ChatPrechatForm.sass';

export class ChatPrechatForm extends Component {
  static propTypes = {
    onFormCompleted: PropTypes.func,
    visitor: PropTypes.object
  };

  static defaultProps = {
    onFormCompleted: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      valid: false,
      formState: {}
    };

    this.form = null;
  }

  componentWillReceiveProps = (props) => {
    if (props.visitor.email) {
      const formState = _.merge({}, props.visitor, this.state.formState);

      this.setState({ formState });
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
                    .reduce(reduceNames ,{})
                    .value();

    this.setState({
      valid: this.form.checkValidity(),
      formState: values
    });
  }

  render = () => {
    return (
      <form
        noValidate={true}
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        ref={(el) => { this.form = el; }}
        className={`${styles.form}`}>
        <Field
          placeholder={i18n.t('embeddable_framework.common.textLabel.name', { fallback: 'Your name' })}
          required={true}
          value={this.state.formState.display_name}
          name='display_name' />
        <Field
          placeholder={i18n.t('embeddable_framework.common.textLabel.email', { fallback: 'Email' })}
          required={true}
          value={this.state.formState.email}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
          name='email' />
        <Field
          placeholder={i18n.t('embeddable_framework.common.textLabel.phoneNumber', { fallback: 'Phone Number' })}
          required={true}
          type='number'
          value={this.state.formState.phone}
          name='phone' />
        <Field
          placeholder={i18n.t('embeddable_framework.common.textLabel.message', { fallback: 'Message' })}
          required={true}
          value={this.state.formState.message}
          input={<textarea rows='3' />}
          name='message' />
        <Button
          label={i18n.t('embeddable_framework.chat.preChat.online.button.startChat')}
          disabled={!this.state.valid}
          className={styles.button}
          type='submit' />
      </form>
    );
  }
}
