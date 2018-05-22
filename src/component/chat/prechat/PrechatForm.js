import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';

import { Field } from 'component/field/Field';
import { Button } from 'component/button/Button';
import { Dropdown } from 'component/field/Dropdown';
import { ChatSocialLogin } from 'component/chat/ChatSocialLogin';

import { i18n } from 'service/i18n';

import { locals as styles } from './PrechatForm.scss';

export class PrechatForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    formState: PropTypes.object,
    onPrechatFormChange: PropTypes.func,
    greetingMessage: PropTypes.string,
    visitor: PropTypes.object.isRequired,
    onFormCompleted: PropTypes.func,
    loginEnabled: PropTypes.bool,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired
  };

  static defaultProps = {
    form: {},
    formState: {},
    onPrechatFormChange: () => {},
    greetingMessage: '',
    visitor: {},
    onFormCompleted: () => {},
    loginEnabled: true,
    authUrls: {},
    socialLogin: {}
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
    const { authenticated } = this.props.socialLogin;
    const { visitor } = this.props;
    const formData = authenticated ?
      { ...this.props.formState, name: visitor.display_name, email: visitor.email }
      : this.props.formState;

    this.props.onFormCompleted(formData);
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

    this.props.onPrechatFormChange(values);

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
    const { loginEnabled, form, formState, authUrls } = this.props;

    if (!loginEnabled) return null;

    const nameData = form.name;
    const required = this.isFieldRequired(nameData.required);
    const fieldContainerStyle = classNames({
      [styles.nameFieldWithSocialLogin]: _.size(authUrls) > 0
    });

    return (
      <Field
        fieldContainerClasses={fieldContainerStyle}
        label={i18n.t('embeddable_framework.common.textLabel.name')}
        required={required}
        value={formState.name}
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

  renderSocialLogin() {
    return (
      <ChatSocialLogin
        authUrls={this.props.authUrls}
        socialLogin={this.props.socialLogin}
        visitor={this.props.visitor}
        initiateSocialLogout={this.props.initiateSocialLogout}
        nameField={this.renderNameField()}
        emailField={this.renderEmailField()} />
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
        {this.renderSocialLogin()}
        {this.renderDepartmentsField()}
        {this.renderPhoneField()}
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
