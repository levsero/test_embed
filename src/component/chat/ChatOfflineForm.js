import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { i18n } from 'service/i18n';
import classNames from 'classnames';
import { TextField, Label, Input, Textarea } from '@zendeskgarden/react-textfields';

import { ZendeskLogo } from 'component/ZendeskLogo';
import { Button } from 'component/button/Button';
import { EmailField } from 'component/field/EmailField';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { ChatOperatingHours } from 'component/chat/ChatOperatingHours';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { OFFLINE_FORM_SCREENS } from 'constants/chat';
import { ChatOfflineMessageForm } from 'component/chat/ChatOfflineMessageForm';
import { UserProfile } from 'component/chat/UserProfile';
import { SuccessNotification } from 'component/shared/SuccessNotification';
import { ICONS } from 'src/constants/shared';
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
    visitor: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    newHeight: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool
  };

  static defaultProps = {
    updateFrameSize: () => {},
    operatingHours: { enabled: false },
    isMobile: false,
    offlineMessage: {},
    initiateSocialLogout: () => {},
    socialLogin: {},
    authUrls: {},
    hideZendeskLogo: false
  };

  constructor(props) {
    super(props);

    this.offlineForm = null;

    this.state = {
      valid: false
    };
  }

  getScrollContainerClasses() {
    return classNames(styles.scrollContainer, {
      [styles.mobileContainer]: this.props.isMobile
    });
  }

  renderNameField() {
    const { formFields, formState, authUrls } = this.props;
    const isRequired = !!_.get(formFields, 'name.required');
    const value = _.get(formState, 'name', '');
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
          required={isRequired}
          value={value}
          onChange={() => {}}
          name='name' />
      </TextField>
    );
  }

  renderEmailField() {
    const isRequired = !!_.get(this.props.formFields, 'email.required');
    const value = _.get(this.props.formState, 'email', '');

    return (
      <EmailField
        label={i18n.t('embeddable_framework.common.textLabel.email')}
        value={value}
        name='email'
        required={isRequired} />
    );
  }

  renderPhoneNumberField() {
    const isRequired = !!_.get(this.props.formFields, 'phone.required');
    const value = _.get(this.props.formState, 'phone', '');

    return (
      <TextField className={styles.textField}>
        <Label>
          {i18n.t('embeddable_framework.common.textLabel.phone_number')}
        </Label>
        <Input
          required={isRequired}
          value={value}
          onChange={() => {}}
          type='tel'
          name='phone' />
      </TextField>
    );
  }

  renderMessageField() {
    const isRequired = !!_.get(this.props.formFields, 'message.required');
    const value = _.get(this.props.formState, 'message', '');

    return (
      <TextField>
        <Label>
          {i18n.t('embeddable_framework.common.textLabel.message')}
        </Label>
        <Textarea
          required={isRequired}
          value={value}
          onChange={() => {}}
          rows='5'
          name='message' />
      </TextField>
    );
  }

  renderSuccess() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.SUCCESS) return;

    if (this.props.newHeight) {
      return (
        <ScrollContainer
          ref='scrollContainer'
          classes={this.getScrollContainerClasses()}
          containerClasses={styles.scrollContainerContent}
          title={i18n.t('embeddable_framework.chat.title')}
          newHeight={this.props.newHeight}>
          <SuccessNotification
            icon={ICONS.SUCCESS_CONTACT_FORM}
            isMobile={this.props.isMobile} />
          <Button
            onTouchStartDisabled={true}
            label={i18n.t('embeddable_framework.common.button.done')}
            className={styles.doneButton}
            primary={false}
            onClick={this.props.handleOfflineFormBack}
            type='button'
            fullscreen={this.props.isMobile} />
        </ScrollContainer>
      );
    }

    return (
      <ScrollContainer
        ref='scrollContainer'
        classes={this.getScrollContainerClasses()}
        containerClasses={styles.scrollContainerContent}
        title={i18n.t('embeddable_framework.chat.title')}
        newHeight={this.props.newHeight}>
        <ChatOfflineMessageForm
          offlineMessage={this.props.offlineMessage}
          onFormBack={this.props.handleOfflineFormBack} />
      </ScrollContainer>
    );
  }

  renderLoading() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.LOADING) return;

    return (
      <ScrollContainer
        ref='scrollContainer'
        classes={this.getScrollContainerClasses()}
        containerClasses={styles.loadingSpinnerContainer}
        title={i18n.t('embeddable_framework.chat.title')}
        newHeight={this.props.newHeight}>
        <div className={styles.loadingSpinner}>
          <LoadingSpinner />
        </div>
      </ScrollContainer>
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

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { authenticated: isSociallyAuthenticated } = this.props.socialLogin;
    const { visitor, formState, isAuthenticated } = this.props;
    const formData = (isSociallyAuthenticated || isAuthenticated)
      ? { ...formState, name: visitor.display_name, email: visitor.email }
      : this.props.formState;

    this.props.sendOfflineMessage(formData);
  }

  renderSubmitButton() {
    return (
      <Button
        className={styles.submitBtn}
        onTouchStartDisabled={true}
        label={i18n.t('embeddable_framework.chat.preChat.offline.button.sendMessage')}
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

  validate() {
    const isFormValid = this.offlineForm.checkValidity();
    const isFormStateEmpty = _.isEmpty(this.props.formState);

    this.setState({ valid: isFormValid && !isFormStateEmpty });
  }

  handleFormChanged = (e) => {
    if (!this.offlineForm) return;

    const { name, value } = e.target;
    const fieldState = { [name]: value };
    const formState = { ...this.props.formState, ...fieldState };

    this.validate();
    this.props.chatOfflineFormChanged(formState);
  }

  renderForm() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.MAIN) return null;

    return (
      <form
        ref={(el) => { this.offlineForm = el; }}
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChanged}>
        <ScrollContainer
          ref='scrollContainer'
          classes={this.getScrollContainerClasses()}
          containerClasses={styles.scrollContainerContent}
          footerContent={this.renderSubmitButton()}
          title={i18n.t('embeddable_framework.chat.title')}
          newHeight={this.props.newHeight}
          scrollShadowVisible={true}>
          {this.renderOfflineGreeting()}
          {this.renderOperatingHoursLink()}
          {this.renderUserProfile()}
          {this.renderPhoneNumberField()}
          {this.renderMessageField()}
          {this.renderZendeskLogo()}
        </ScrollContainer>
      </form>
    );
  }

  renderOperatingHours() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.OPERATING_HOURS) return null;

    const { operatingHours, handleOfflineFormBack } = this.props;

    return (
      <ScrollContainer
        ref='scrollContainer'
        classes={this.getScrollContainerClasses()}
        containerClasses={styles.scrollContainerContent}
        title={i18n.t('embeddable_framework.chat.title')}
        newHeight={this.props.newHeight}>
        <ChatOperatingHours
          handleOfflineFormBack={handleOfflineFormBack}
          operatingHours={operatingHours} />
      </ScrollContainer>
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
