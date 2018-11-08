import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { i18n } from 'service/i18n';
import classNames from 'classnames';
import { Message, TextField, Label, Input, Textarea } from '@zendeskgarden/react-textfields';

import { ZendeskLogo } from 'component/ZendeskLogo';
import { Button } from '@zendeskgarden/react-buttons';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { ChatOperatingHours } from 'component/chat/ChatOperatingHours';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { OFFLINE_FORM_SCREENS } from 'constants/chat';
import { UserProfile } from 'component/chat/UserProfile';
import { SuccessNotification } from 'component/shared/SuccessNotification';
import { ICONS, NAME_PATTERN, EMAIL_PATTERN, PHONE_PATTERN } from 'src/constants/shared';
import { locals as styles } from './ChatOfflineForm.scss';
import { shouldRenderErrorMessage, renderLabel } from 'src/util/fields';

export class ChatOfflineForm extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    chatOfflineFormChanged: PropTypes.func.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    operatingHours: PropTypes.object,
    sendOfflineMessage: PropTypes.func.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired,
    handleOperatingHoursClick: PropTypes.func.isRequired,
    offlineMessage: PropTypes.object.isRequired,
    readOnlyState: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    formFields: PropTypes.object.isRequired,
    phoneEnabled: PropTypes.bool,
    greeting: PropTypes.string.isRequired,
    isMobile: PropTypes.bool,
    socialLogin: PropTypes.object.isRequired,
    authUrls: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool,
    getFrameContentDocument: PropTypes.func.isRequired,
    widgetShown: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    operatingHours: { enabled: false },
    isMobile: false,
    phoneEnabled: true,
    offlineMessage: {},
    initiateSocialLogout: () => {},
    socialLogin: {},
    authUrls: {},
    hideZendeskLogo: false,
    getFrameContentDocument: () => ({}),
    formState: {},
    readOnlyState: {}
  };

  constructor(props) {
    super(props);

    this.offlineForm = null;

    this.state = {
      valid: false,
      showErrors: false
    };
  }

  componentDidMount() {
    if (this.props.offlineMessage.screen === OFFLINE_FORM_SCREENS.MAIN) {
      this.validate();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.widgetShown && this.props.widgetShown) {
      this.validate();
    }
  }

  getScrollContainerClasses() {
    return classNames(styles.scrollContainer, {
      [styles.mobileContainer]: this.props.isMobile
    });
  }

  renderErrorMessage(value, required, errorString, pattern) {
    if (shouldRenderErrorMessage(value, required, this.state.showErrors, pattern)) {
      return <Message validation='error'>{i18n.t(errorString)}</Message>;
    }
    return null;
  }

  renderNameField() {
    const { formFields, formState, authUrls, readOnlyState } = this.props;
    const isRequired = !!_.get(formFields, 'name.required');
    const value = formState.name;
    const fieldContainerStyle = classNames({
      [styles.nameFieldWithSocialLogin]: _.size(authUrls) > 0,
      [styles.textField]: _.size(authUrls) === 0
    });
    const error = this.renderErrorMessage(value, isRequired,
      'embeddable_framework.validation.error.name', NAME_PATTERN);

    return (
      <TextField className={fieldContainerStyle}>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.common.textLabel.name'),
          isRequired || !!readOnlyState.name
        )}
        <Input
          required={isRequired}
          aria-required={isRequired}
          value={value}
          autoComplete='off'
          onChange={() => {}}
          name='name'
          validation={error ? 'error' : 'none'}
          pattern={NAME_PATTERN.source}
          readOnly={readOnlyState.name} />
        {error}
      </TextField>
    );
  }

  renderEmailField() {
    const isRequired = !!_.get(this.props.formFields, 'email.required');
    const value = this.props.formState.email;
    const error = this.renderErrorMessage(value,
      isRequired, 'embeddable_framework.validation.error.email', EMAIL_PATTERN);

    /* eslint-disable max-len */
    return (
      <TextField>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.common.textLabel.email'),
          isRequired || !!this.props.readOnlyState.email
        )}
        <Input
          required={isRequired}
          aria-required={isRequired}
          value={value}
          onChange={() => {}}
          name='email'
          validation={error ? 'error' : 'none'}
          readOnly={this.props.readOnlyState.email}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" />
        {error}
      </TextField>
    );
    /* eslint-enable max-len */
  }

  renderPhoneNumberField() {
    if (!this.props.phoneEnabled) return null;

    const isRequired = !!_.get(this.props.formFields, 'phone.required');
    const value = this.props.formState.phone;
    const error = this.renderErrorMessage(value,
      isRequired, 'embeddable_framework.validation.error.phone', PHONE_PATTERN);

    return (
      <TextField className={styles.textField}>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.common.textLabel.phone_number'),
          isRequired || !!this.props.readOnlyState.phone
        )}
        <Input
          required={isRequired}
          aria-required={isRequired}
          value={value}
          onChange={() => {}}
          type='tel'
          name='phone'
          readOnly={this.props.readOnlyState.phone}
          pattern={PHONE_PATTERN.source}
          validation={error ? 'error' : 'none'} />
        {error}
      </TextField>
    );
  }

  renderMessageField() {
    const isRequired = !!_.get(this.props.formFields, 'message.required');
    const value = this.props.formState.message;
    const error = this.renderErrorMessage(value, isRequired, 'embeddable_framework.validation.error.message', null);

    return (
      <TextField>
        {renderLabel(Label, i18n.t('embeddable_framework.common.textLabel.message'), isRequired)}
        <Textarea
          required={isRequired}
          aria-required={isRequired}
          value={value}
          onChange={() => {}}
          rows='5'
          name='message'
          validation={error ? 'error' : 'none'} />
        {error}
      </TextField>
    );
  }

  renderSuccess() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.SUCCESS) return;

    return (
      <ScrollContainer
        ref='scrollContainer'
        classes={this.getScrollContainerClasses()}
        containerClasses={styles.scrollContainerContent}
        title={this.props.title}>
        <SuccessNotification
          icon={ICONS.SUCCESS_CONTACT_FORM}
          isMobile={this.props.isMobile} />
        <Button
          primary={true}
          className={styles.doneButton}
          onClick={this.props.handleOfflineFormBack}>
          {i18n.t('embeddable_framework.common.button.done')}
        </Button>
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
        title={this.props.title}>
        <div className={styles.loadingSpinner}>
          <LoadingSpinner />
        </div>
      </ScrollContainer>
    );
  }

  renderOfflineGreeting() {
    const { greeting } = this.props;

    return (
      <p className={styles.offlineGreeting}>
        {greeting}
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

    if (!this.state.valid) {
      this.setState({ showErrors: true });
      return;
    }
    this.setState({ showErrors: false });

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
        primary={true}
        className={styles.submitBtn}
        type='submit'>
        {i18n.t('embeddable_framework.chat.preChat.offline.button.sendMessage')}
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
        noValidate={true}
        ref={(el) => { this.offlineForm = el; }}
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChanged}>
        <ScrollContainer
          ref='scrollContainer'
          classes={this.getScrollContainerClasses()}
          containerClasses={styles.scrollContainerContent}
          footerContent={this.renderSubmitButton()}
          title={this.props.title}
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

    const { operatingHours, handleOfflineFormBack, getFrameContentDocument } = this.props;

    return (
      <ScrollContainer
        ref='scrollContainer'
        classes={this.getScrollContainerClasses()}
        containerClasses={styles.scrollContainerContent}
        title={this.props.title}>
        <ChatOperatingHours
          getFrameContentDocument={getFrameContentDocument}
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
