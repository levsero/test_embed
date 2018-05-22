import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { i18n } from 'service/i18n';
import classNames from 'classnames';

import { Form } from 'component/form/Form';
import { Field } from 'component/field/Field';
import { EmailField } from 'component/field/EmailField';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { ChatOperatingHours } from 'component/chat/ChatOperatingHours';
import { OFFLINE_FORM_SCREENS } from 'constants/chat';
import { ChatOfflineMessageForm } from 'component/chat/ChatOfflineMessageForm';
import { ChatSocialLogin } from 'component/chat/ChatSocialLogin';

import { locals as styles } from './ChatOfflineForm.scss';

export class ChatOfflineForm extends Component {
  static propTypes = {
    updateFrameSize: PropTypes.func.isRequired,
    chatOfflineFormChanged: PropTypes.func.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    operatingHours: PropTypes.object,
    sendOfflineMessage: PropTypes.func.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired,
    handleOperatingHoursClick: PropTypes.func.isRequired,
    offlineMessage: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    formFields: PropTypes.object.isRequired,
    isMobile: PropTypes.bool,
    socialLogin: PropTypes.object.isRequired,
    authUrls: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired
  };

  static defaultProps = {
    updateFrameSize: () => {},
    operatingHours: { enabled: false },
    isMobile: false,
    offlineMessage: {},
    initiateSocialLogout: () => {},
    socialLogin: {},
    authUrls: {}
  };

  renderNameField() {
    const { formFields, formState, authUrls } = this.props;
    const isRequired = !!_.get(formFields, 'name.required');
    const value = _.get(formState, 'name', '');
    const fieldContainerStyle = classNames({
      [styles.nameFieldWithSocialLogin]: _.size(authUrls) > 0
    });

    return (
      <Field
        name='name'
        fieldContainerClasses={fieldContainerStyle}
        label={i18n.t('embeddable_framework.common.textLabel.name')}
        value={value}
        required={isRequired} />
    );
  }

  renderEmailField() {
    const isRequired = !!_.get(this.props.formFields, 'email.required');
    const value = _.get(this.props.formState, 'email', '');

    return (
      <EmailField
        label={i18n.t('embeddable_framework.common.textLabel.email')}
        value={value}
        required={isRequired} />
    );
  }

  renderPhoneNumberField() {
    const isRequired = !!_.get(this.props.formFields, 'phone.required');
    const value = _.get(this.props.formState, 'phone', '');

    return (
      <Field
        key='phone'
        name='phone'
        label={i18n.t('embeddable_framework.common.textLabel.phone_number')}
        value={value}
        required={isRequired} />
    );
  }

  renderMessageField() {
    const isRequired = !!_.get(this.props.formFields, 'message.required');
    const value = _.get(this.props.formState, 'message', '');

    return (
      <Field
        key='message'
        name='message'
        label={i18n.t('embeddable_framework.common.textLabel.message')}
        input={<textarea rows='5' />}
        value={value}
        required={isRequired} />
    );
  }

  renderSuccess() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.SUCCESS) return;

    return (
      <ChatOfflineMessageForm
        offlineMessage={this.props.offlineMessage}
        onFormBack={this.props.handleOfflineFormBack} />
    );
  }

  renderLoading() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.LOADING) return;

    return (
      <div className={styles.loadingSpinner}>
        <LoadingSpinner />
      </div>
    );
  }

  renderOfflineGreeting() {
    const offlineGreetingText = i18n.t('embeddable_framework.chat.preChat.offline.greeting');

    return (
      <p className={styles.offlineGreeting}>
        {offlineGreetingText}
      </p>
    );
  }

  renderOperatingHoursLink() {
    const { operatingHours } = this.props;

    if (!operatingHours.enabled) return;

    const operatingHoursAnchor = i18n.t('embeddable_framework.chat.operatingHours.label.anchor');

    return (
      <p className={styles.operatingHoursContainer}>
        <a className={styles.operatingHoursLink}
          onClick={this.props.handleOperatingHoursClick}>
          {operatingHoursAnchor}
        </a>
      </p>
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

  renderForm() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.MAIN) return;

    const submitbuttonText = i18n.t('embeddable_framework.chat.preChat.offline.button.sendMessage');
    const { authenticated } = this.props.socialLogin;
    const { visitor, formState } = this.props;
    const formData = authenticated ?
      { ...formState, name: visitor.display_name, email: visitor.email }
      : this.props.formState;

    return (
      <Form
        formState={formData}
        onCompleted={this.props.sendOfflineMessage}
        onChange={this.props.chatOfflineFormChanged}
        submitButtonClasses={styles.submitButton}
        submitButtonLabel={submitbuttonText}>
        {this.renderOfflineGreeting()}
        {this.renderOperatingHoursLink()}
        {this.renderSocialLogin()}
        {this.renderPhoneNumberField()}
        {this.renderMessageField()}
      </Form>
    );
  }

  renderOperatingHours() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.OPERATING_HOURS) return;

    const { operatingHours, handleOfflineFormBack } = this.props;

    return (
      <ChatOperatingHours
        handleOfflineFormBack={handleOfflineFormBack}
        operatingHours={operatingHours} />
    );
  }

  render() {
    return (
      <div>
        {this.renderForm()}
        {this.renderLoading()}
        {this.renderSuccess()}
        {this.renderOperatingHours()}
      </div>
    );
  }
}
