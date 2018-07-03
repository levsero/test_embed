import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { TextField, Label, Input, Textarea } from '@zendeskgarden/react-textfields';
import {
  Select,
  SelectField,
  Label as SelectLabel,
  Item } from '@zendeskgarden/react-select';

import { EmailField } from 'component/field/EmailField';
import { Button } from 'component/button/Button';
import { UserProfile } from 'component/chat/UserProfile';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';

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
      valid: false
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
      [styles.nameFieldWithSocialLogin]: _.size(authUrls) > 0,
      [styles.textField]: _.size(authUrls) === 0
    });

    return (
      <TextField className={fieldContainerStyle}>
        <Label>
          {i18n.t('embeddable_framework.common.textLabel.name')}
        </Label>
        <Input
          autoComplete='off'
          required={required}
          value={formState.name}
          onChange={() => {}}
          name={nameData.name} />
      </TextField>
    );
  }

  renderEmailField = () => {
    if (!this.props.loginEnabled) return null;

    const emailData = this.props.form.email;
    const required = this.isFieldRequired(emailData.required);

    return (
      <EmailField
        label={i18n.t('embeddable_framework.common.textLabel.email')}
        value={this.props.formState.email}
        name={emailData.name}
        required={required} />
    );
  }

  renderPhoneField = () => {
    const phoneData = this.props.form.phone;

    if (!this.props.loginEnabled || phoneData.hidden) return null;

    const phonePattern = '[0-9]+'; // taken from Chat SDK

    return (
      <TextField className={styles.textField}>
        <Label>
          {i18n.t('embeddable_framework.common.textLabel.phone_number')}
        </Label>
        <Input
          required={phoneData.required}
          value={this.props.formState.phone}
          onChange={() => {}}
          type='tel'
          pattern={phonePattern}
          name={phoneData.name} />
      </TextField>
    );
  }

  renderMessageField = () => {
    const messageData = this.props.form.message;
    const required = this.isFieldRequired(messageData.required);

    return (
      <TextField>
        <Label>
          {i18n.t('embeddable_framework.common.textLabel.message')}
        </Label>
        <Textarea
          required={required}
          value={this.props.formState.message}
          onChange={() => {}}
          rows='4'
          name={messageData.name} />
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

    return (
      <SelectField className={styles.textField}>
        <SelectLabel>
          {departmentSettings.label}
        </SelectLabel>
        <Select
          required={departmentSettings.required}
          placeholder={i18n.t('embeddable_framework.chat.preChat.online.dropdown.selectDepartment')}
          name='department'
          selectedKey={selectedDepartment.id}
          appendToNode={this.props.getFrameContentDocument().body}
          onChange={this.handleSelectChange}
          popperModifiers={{ flip: { enabled: false }, preventOverflow: { escapeWithReference: true } }}
          dropdownProps={{ style: { maxHeight: '140px', overflow: 'auto' } }}
          options={options}>
          {selectedDepartment.name}
        </Select>
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
        className={styles.submitBtn}
        onTouchStartDisabled={true}
        label={i18n.t('embeddable_framework.chat.preChat.online.button.startChat')}
        disabled={!this.state.valid}
        type='submit' />
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
