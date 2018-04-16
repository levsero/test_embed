import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Field } from 'component/field/Field';
import { Button } from 'component/button/Button';
import { Dropdown } from 'component/field/Dropdown';

import { i18n } from 'service/i18n';

import { locals as styles } from './ChatPrechatForm.scss';

export class ChatPrechatForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    formState: PropTypes.object,
    setFormState: PropTypes.func,
    greetingMessage: PropTypes.string,
    visitor: PropTypes.object,
    onFormCompleted: PropTypes.func,
    loginEnabled: PropTypes.bool
  };

  static defaultProps = {
    form: {},
    formState: {},
    setFormState: () => {},
    greetingMessage: '',
    visitor: {},
    onFormCompleted: () => {},
    loginEnabled: true
  };

  constructor() {
    super();

    this.state = {
      valid: false
    };

    this.form = null;
  }

  componentDidMount = () => {
    this.handleFormChange();
  }

  isDepartmentOffline = (departments, departmentId) => {
    const department = _.find(departments, (d) => d.id == departmentId); // eslint-disable-line eqeqeq

    return _.get(department, 'status') === 'offline';
  }

  isFieldRequired = (fallback = false) => {
    const { form, formState } = this.props;
    const isDepartmentSelected = formState.department !== '';

    return (isDepartmentSelected)
      ? this.isDepartmentOffline(form.departments, formState.department)
      : fallback;
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.props.onFormCompleted(this.props.formState);
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

    this.props.setFormState(values);

    // The `checkValidity` is not available on the form dom element created
    // by jsdom during unit testing. This sanity check allows our unit tests to pass.
    // See this Github issue: https://github.com/tmpvar/jsdom/issues/544
    setTimeout(() => {
      const valid = !!(this.form.checkValidity && this.form.checkValidity());

      // FIXME: This is not tested due to timing pollution on our specs
      this.setState({ valid });
    }, 0);
  }

  renderGreetingMessage = () => {
    const { greetingMessage } = this.props;

    return greetingMessage !== ''
         ? <div className={styles.greetingMessage}>{greetingMessage}</div>
         : null;
  }

  renderNameField = () => {
    if (!this.props.loginEnabled) return null;

    const nameData = this.props.form.name;
    const required = this.isFieldRequired(nameData.required);

    return (
      <Field
        label={i18n.t('embeddable_framework.common.textLabel.name')}
        required={required}
        value={this.props.formState.name}
        name={nameData.name} />
    );
  }

  renderEmailField = () => {
    if (!this.props.loginEnabled) return null;

    const emailData = this.props.form.email;
    const required = this.isFieldRequired(emailData.required);

    return (
      <Field
        label={i18n.t('embeddable_framework.common.textLabel.email')}
        required={required}
        value={this.props.formState.email}
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
        name={emailData.name} />
    );
  }

  renderPhoneField = () => {
    const phoneData = this.props.form.phone;

    if (!this.props.loginEnabled || phoneData.hidden) return null;

    const phonePattern = '[0-9]+'; // taken from Chat SDK

    return (
      <Field
        label={i18n.t('embeddable_framework.common.textLabel.phone_number')}
        required={phoneData.required}
        type={'tel'}
        value={this.props.formState.phone}
        pattern={phonePattern}
        name={phoneData.name} />
    );
  }

  renderMessageField = () => {
    const messageData = this.props.form.message;
    const required = this.isFieldRequired(messageData.required);

    return (
      <Field
        label={i18n.t('embeddable_framework.common.textLabel.message')}
        required={required}
        value={this.props.formState.message}
        input={<textarea rows='3' />}
        name={messageData.name} />
    );
  }

  renderDepartmentsField = () => {
    const { department: departmentSettings, departments } = this.props.form;
    const placeholderNode = (
      <span className={styles.defaultDropdownText}>
        {i18n.t('embeddable_framework.chat.preChat.online.dropdown.selectDepartment')}
      </span>
    );

    if (_.size(departments) === 0) return null;

    return (
      <Dropdown
        className={styles.dropdown}
        menuContainerClassName={styles.dropdownMenuContainer}
        label={departmentSettings.label}
        required={departmentSettings.required}
        name='department'
        options={departments}
        onChange={this.handleFormChange}
        placeholderNode={placeholderNode}
        disableMenuUp={true}
      />
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
        {this.renderDepartmentsField()}
        {this.renderMessageField()}
        <Button
          onTouchStartDisabled={true}
          label={i18n.t('embeddable_framework.chat.preChat.online.button.startChat')}
          disabled={!this.state.valid}
          className={styles.button}
          type='submit' />
      </form>
    );
  }
}
