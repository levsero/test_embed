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
import { shouldRenderErrorMessage, renderLabelText } from 'src/util/fields';
import { FONT_SIZE, EMAIL_PATTERN, PHONE_PATTERN } from 'src/constants/shared';

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
    initiateSocialLogout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    newHeight: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool
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

  isFieldRequired = (fallback = false) => {
    const { form, formState } = this.props;
    const isDepartmentSelected = formState.department !== '';

    return (isDepartmentSelected)
      ? this.isDepartmentOffline(form.departments, formState.department)
      : fallback;
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

    // The `checkValidity` is not available on the form dom element created
    // by jsdom during unit testing. This sanity check allows our unit tests to pass.
    // See this Github issue: https://github.com/tmpvar/jsdom/issues/544
    setTimeout(() => {
      const { form, formState } = this.props;
      const valid = !!(this.form.checkValidity && this.form.checkValidity());
      const deptValid = _.get(form, 'department.required') && formState.department;

      // FIXME: This is not tested due to timing pollution on our specs
      this.setState({ valid: valid && deptValid });
    }, 0);
  }

  handleSelectChange = (value) => {
    this.props.onPrechatFormChange({ department: value });

    this.handleFormChange();
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
    const { loginEnabled, form, formState, authUrls } = this.props;

    if (!loginEnabled) return null;

    const nameData = form.name;
    const value = formState.name;
    const required = this.isFieldRequired(nameData.required);
    const fieldContainerStyle = classNames({
      [styles.nameFieldWithSocialLogin]: _.size(authUrls) > 0,
      [styles.textField]: _.size(authUrls) === 0
    });

    const error = this.renderErrorMessage(Message, value, required, 'embeddable_framework.validation.error.name');
    const validationProps = error ? { validation: 'error' } : {};

    return (
      <TextField className={fieldContainerStyle}>
        <Label>
          {renderLabelText(i18n.t('embeddable_framework.common.textLabel.name'), required)}
        </Label>
        <Input
          autoComplete='off'
          aria-required={required}
          required={required}
          value={value}
          onChange={() => {}}
          name={nameData.name}
          {...validationProps} />
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
    const validationProps = error ? { validation: 'error' } : {};

    return (
      <TextField>
        <Label>
          {renderLabelText(i18n.t('embeddable_framework.common.textLabel.email'), required)}
        </Label>
        <Input
          required={required}
          aria-required={required}
          value={value}
          onChange={() => {}}
          type='email'
          name={emailData.name}
          {...validationProps} />
        {error}
      </TextField>
    );
  }

  renderPhoneField = () => {
    const phoneData = this.props.form.phone;

    if (!this.props.loginEnabled || phoneData.hidden) return null;

    const value = this.props.formState.phone;
    const required = phoneData.required;
    const error = this.renderErrorMessage(Message, value, required,
      'embeddable_framework.validation.error.phone', PHONE_PATTERN);
    const validationProps = error ? { validation: 'error' } : {};

    return (
      <TextField>
        <Label>
          {renderLabelText(i18n.t('embeddable_framework.common.textLabel.phone_number'), required)}
        </Label>
        <Input
          required={required}
          aria-required={required}
          value={value}
          onChange={() => {}}
          type='tel'
          name={phoneData.name}
          {...validationProps} />
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
    const validationProps = error ? { validation: 'error' } : {};

    return (
      <TextField>
        <Label>
          {renderLabelText(i18n.t('embeddable_framework.common.textLabel.message'), required)}
        </Label>
        <Textarea
          required={required}
          aria-required={required}
          value={value}
          onChange={() => {}}
          rows='4'
          name={messageData.name}
          {...validationProps} />
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
    const validationProps = error ? { validation: 'error' } : {};

    return (
      <SelectField>
        <SelectLabel>
          {departmentSettings.label}
        </SelectLabel>
        <Select
          required={required}
          aria-required={required}
          placeholder={i18n.t('embeddable_framework.chat.preChat.online.dropdown.selectDepartment')}
          name='department'
          selectedKey={value}
          appendToNode={this.props.getFrameContentDocument().body}
          onChange={this.handleSelectChange}
          popperModifiers={{ flip: { enabled: false }, preventOverflow: { escapeWithReference: true } }}
          dropdownProps={{ style: { maxHeight: `${140/FONT_SIZE}rem`, overflow: 'auto' }}}
          options={options}
          {...validationProps}>
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
    const scrollContainerClasses = classNames(styles.scrollContainer, {
      [styles.mobileContainer]: this.props.isMobile
    });

    return (
      <form
        noValidate={true}
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        ref={(el) => { this.form = el; }}
        className={`${styles.form}`}>
        <ScrollContainer
          title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
          classes={scrollContainerClasses}
          containerClasses={styles.scrollContainerContent}
          footerContent={this.renderSubmitButton()}
          fullscreen={this.props.isMobile}
          newHeight={this.props.newHeight}
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
