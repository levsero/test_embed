import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { TextField, Label, Input, Textarea, Message } from '@zendeskgarden/react-textfields';
import {
  Select,
  SelectField,
  Label as SelectLabel,
  Message as SelectMessage,
  Item } from '@zendeskgarden/react-select';

import { Button } from '@zendeskgarden/react-buttons';
import { UserProfile } from 'component/chat/UserProfile';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';

import { i18n } from 'service/i18n';

import { locals as styles } from './PrechatForm.scss';
import { shouldRenderErrorMessage, renderLabel } from 'src/util/fields';
import { FONT_SIZE, NAME_PATTERN, EMAIL_PATTERN, PHONE_PATTERN } from 'src/constants/shared';

export class PrechatForm extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    form: PropTypes.object,
    formState: PropTypes.object,
    readOnlyState: PropTypes.object.isRequired,
    onPrechatFormChange: PropTypes.func,
    greetingMessage: PropTypes.string,
    visitor: PropTypes.object.isRequired,
    onFormCompleted: PropTypes.func,
    loginEnabled: PropTypes.bool,
    phoneEnabled: PropTypes.bool,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool
  };

  static defaultProps = {
    form: {},
    formState: {},
    readOnlyState: {},
    onPrechatFormChange: () => {},
    greetingMessage: '',
    visitor: {},
    onFormCompleted: () => {},
    loginEnabled: true,
    phoneEnabled: true,
    authUrls: {},
    socialLogin: {},
    isMobile: false,
    hideZendeskLogo: false,
    getFrameContentDocument: () => ({})
  };

  constructor() {
    super();

    this.state = {
      valid: false,
      showErrors: false
    };

    this.form = null;
  }

  componentDidMount = () => {
    this.handleFormChange();
  }

  isDepartmentOffline = (departments, departmentId) => {
    const department = this.findDepartment(departments, departmentId);

    return _.get(department, 'status') === 'offline';
  }

  findDepartment = (departments, departmentId) => {
    return _.find(departments, (d) => d.id == departmentId) || {}; // eslint-disable-line eqeqeq
  }

  isFieldRequired = (required = false) => {
    const { form, formState } = this.props;
    const isDepartmentSelected = formState.department !== '';

    if (isDepartmentSelected) {
      return this.isDepartmentOffline(form.departments, formState.department) ? true : required;
    } else {
      return required;
    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    if (!this.state.valid) {
      this.setState({ showErrors: true });
      return;
    }
    this.setState({ showErrors: false });

    const { authenticated: isSociallyAuthenticated } = this.props.socialLogin;
    const { visitor, isAuthenticated } = this.props;
    const formData = isSociallyAuthenticated || isAuthenticated
      ? { ...this.props.formState, name: visitor.display_name, email: visitor.email }
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

    setTimeout(() => {
      const valid = !!(this.form.checkValidity());

      // FIXME: This is not tested due to timing pollution on our specs
      this.setState({ valid: valid && this.isDepartmentFieldValid() });
    }, 0);
  }

  handleSelectChange = (value) => {
    this.props.onPrechatFormChange({ department: value });

    this.handleFormChange();
  }

  isDepartmentFieldValid = () => {
    const { form, formState } = this.props;

    return _.get(form, 'department.required') &&
      _.size(form.departments) > 0 ? formState.department : true;
  }

  renderErrorMessage(Component, value, required, errorString, pattern) {
    if (shouldRenderErrorMessage(value, required, this.state.showErrors, pattern)) {
      return <Component validation='error'>{i18n.t(errorString)}</Component>;
    }
    return null;
  }

  renderGreetingMessage = () => {
    const { greetingMessage } = this.props;

    return greetingMessage !== ''
      ? <div className={styles.greetingMessage}>{greetingMessage}</div>
      : null;
  }

  renderNameField = () => {
    const { loginEnabled, form, formState, authUrls, readOnlyState } = this.props;

    if (!loginEnabled) return null;

    const nameData = form.name;
    const value = formState.name;
    const required = this.isFieldRequired(nameData.required);
    const fieldContainerStyle = classNames({
      [styles.nameFieldWithSocialLogin]: _.size(authUrls) > 0,
      [styles.textField]: _.size(authUrls) === 0
    });

    const error = this.renderErrorMessage(Message, value, required,
      'embeddable_framework.validation.error.name', NAME_PATTERN);

    return (
      <TextField className={fieldContainerStyle}>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.common.textLabel.name'),
          required || !!readOnlyState.name
        )}
        <Input
          autoComplete='off'
          aria-required={required}
          required={required}
          readOnly={readOnlyState.name}
          value={value}
          onChange={() => {}}
          name={nameData.name}
          validation={error ? 'error' : 'none'} />
        {error}
      </TextField>
    );
  }

  renderEmailField = () => {
    if (!this.props.loginEnabled) return null;

    const emailData = this.props.form.email;
    const required = this.isFieldRequired(emailData.required);
    const value = this.props.formState.email;

    const error = this.renderErrorMessage(Message, value,
      required, 'embeddable_framework.validation.error.email', EMAIL_PATTERN);

    /* eslint-disable max-len */
    return (
      <TextField>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.common.textLabel.email'),
          required || !!this.props.readOnlyState.email
        )}
        <Input
          required={required}
          aria-required={required}
          value={value}
          readOnly={this.props.readOnlyState.email}
          onChange={() => {}}
          name={emailData.name}
          validation={error ? 'error' : 'none'}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" />
        {error}
      </TextField>
    );
    /* eslint-enable max-len */
  }

  renderPhoneField = () => {
    if (!this.props.loginEnabled || !this.props.phoneEnabled) return null;

    const phoneData = this.props.form.phone;
    const value = this.props.formState.phone;
    const required = phoneData.required;
    const error = this.renderErrorMessage(Message, value, required,
      'embeddable_framework.validation.error.phone', PHONE_PATTERN);

    return (
      <TextField>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.common.textLabel.phone_number'),
          required || !!this.props.readOnlyState.phone
        )}
        <Input
          required={required}
          aria-required={required}
          value={value}
          readOnly={this.props.readOnlyState.phone}
          onChange={() => {}}
          type='tel'
          name={phoneData.name}
          validation={error ? 'error' : 'none'} />
        {error}
      </TextField>
    );
  }

  renderMessageField = () => {
    const messageData = this.props.form.message;
    const required = this.isFieldRequired(messageData.required);
    const value = this.props.formState.message;
    const error = this.renderErrorMessage(Message, value,
      required, 'embeddable_framework.validation.error.message');

    return (
      <TextField className={styles.textAreaMarginBtn}>
        {renderLabel(Label, i18n.t('embeddable_framework.common.textLabel.message'), required)}
        <Textarea
          required={required}
          aria-required={required}
          value={value}
          onChange={() => {}}
          rows='4'
          name={messageData.name}
          validation={error ? 'error' : 'none'} />
        {error}
      </TextField>
    );
  }

  renderDepartmentsField = () => {
    const { department: departmentSettings, departments } = this.props.form;

    if (_.size(departments) === 0) return null;

    const options = _.map(departments, (dept) => {
      return <Item key={dept.id}>{dept.name}</Item>;
    });
    const selectedDepartment = this.findDepartment(departments, this.props.formState.department);
    const required = departmentSettings.required;
    const value = selectedDepartment.id ? selectedDepartment.id.toString() : null;
    const error = this.renderErrorMessage(SelectMessage, value,
      required, 'embeddable_framework.validation.error.department');
    const departmentLabel = departmentSettings.label;

    return (
      <SelectField>
        {renderLabel(SelectLabel, departmentLabel, required)}
        <Select
          required={required}
          aria-required={required}
          placeholder={i18n.t('embeddable_framework.chat.form.common.dropdown.chooseDepartment')}
          name='department'
          selectedKey={value}
          appendToNode={this.props.getFrameContentDocument().body}
          onChange={this.handleSelectChange}
          popperModifiers={{ flip: { enabled: false }, preventOverflow: { escapeWithReference: true } }}
          dropdownProps={{ style: { maxHeight: `${140/FONT_SIZE}rem`, overflow: 'auto' }}}
          options={options}
          validation={error ? 'error' : 'none'}>
          {selectedDepartment.name}
        </Select>
        {error}
      </SelectField>
    );
  }

  renderUserProfile() {
    return (
      <UserProfile
        authUrls={this.props.authUrls}
        socialLogin={this.props.socialLogin}
        visitor={this.props.visitor}
        initiateSocialLogout={this.props.initiateSocialLogout}
        isAuthenticated={this.props.isAuthenticated}
        nameField={this.renderNameField()}
        emailField={this.renderEmailField()} />
    );
  }

  renderSubmitButton() {
    return (
      <Button
        primary={true}
        className={styles.submitBtn}
        type='submit'>
        {i18n.t('embeddable_framework.chat.preChat.online.button.startChat')}
      </Button>
    );
  }

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={`${styles.zendeskLogo}`}
        rtl={i18n.isRTL()}
        fullscreen={false}
      /> : null;
  }

  render = () => {
    return (
      <form
        noValidate={true}
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        ref={(el) => { this.form = el; }}
        className={`${styles.form}`}>
        <ScrollContainer
          title={this.props.title}
          containerClasses={styles.scrollContainerContent}
          footerContent={this.renderSubmitButton()}
          fullscreen={this.props.isMobile}
          scrollShadowVisible={true}>
          {this.renderGreetingMessage()}
          {this.renderUserProfile()}
          {this.renderDepartmentsField()}
          {this.renderPhoneField()}
          {this.renderMessageField()}
          {this.renderZendeskLogo()}
        </ScrollContainer>
      </form>
    );
  }
}
