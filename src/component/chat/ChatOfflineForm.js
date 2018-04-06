import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { i18n } from 'service/i18n';

import { Button } from 'component/button/Button';
import { Form } from 'component/form/Form';
import { Field } from 'component/field/Field';
import { EmailField } from 'component/field/EmailField';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { ChatOperatingHours } from 'component/chat/ChatOperatingHours';
import { OFFLINE_FORM_SCREENS } from 'constants/chat';

import { locals as styles } from './ChatOfflineForm.scss';

export class ChatOfflineForm extends Component {
  static propTypes = {
    updateFrameSize: PropTypes.func.isRequired,
    chatOfflineFormChanged: PropTypes.func.isRequired,
    operatingHours: PropTypes.object,
    sendOfflineMessage: PropTypes.func.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired,
    handleOperatingHoursClick: PropTypes.func.isRequired,
    offlineMessage: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    formFields: PropTypes.object.isRequired,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    updateFrameSize: () => {},
    operatingHours: {},
    isMobile: false,
    offlineMessage: {}
  };

  renderNameField() {
    const isRequired = !!_.get(this.props.formFields, 'name.required');
    const value = _.get(this.props.formState, 'name', '');

    return (
      <Field
        name='name'
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

    const { name, email, phone, message } = this.props.offlineMessage.details;

    return (
      <div className={styles.successContainer}>
        <p className={styles.message}>
         {i18n.t('embeddable_framework.chat.preChat.offline.label.confirmation')}
        </p>
        <div className={styles.info}>
          <b>{name}</b>
          <p>{email}</p>
          <p>{phone}</p>
          <p className={styles.offlineMessage}>{message}</p>
        </div>
        <Button
          onTouchStartDisabled={true}
          label={i18n.t('embeddable_framework.chat.preChat.offline.button.sendAnother')}
          onClick={this.props.handleOfflineFormBack}
          className={styles.backButton} />
      </div>
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

    const operatingHoursAnchor = 'Our Operating Hours';

    return (
      <p className={styles.operatingHoursContainer}>
        <a className={styles.operatingHoursLink}
           onClick={this.props.handleOperatingHoursClick}>
          {operatingHoursAnchor}
        </a>
      </p>
    );
  }

  renderForm() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.MAIN) return;

    const submitbuttonText = i18n.t('embeddable_framework.chat.preChat.offline.button.sendMessage');

    return (
      <Form
        formState={this.props.formState}
        onCompleted={this.props.sendOfflineMessage}
        onChange={this.props.chatOfflineFormChanged}
        submitButtonClasses={styles.submitButton}
        submitButtonLabel={submitbuttonText}>
        {this.renderOfflineGreeting()}
        {this.renderOperatingHoursLink()}
        {this.renderNameField()}
        {this.renderEmailField()}
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
        operatingHours={operatingHours}
        handleOfflineFormBack={handleOfflineFormBack} />
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
