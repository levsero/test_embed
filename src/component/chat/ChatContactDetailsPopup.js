import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { TextField, Label, Input, Message } from '@zendeskgarden/react-textfields';
import { keyCodes } from 'utility/keyboard';
import { document as doc } from 'utility/globals';
import { i18n } from 'service/i18n';
import { nameValid, emailValid } from 'src/util/utils';
import { isDefaultNickname } from 'src/util/chat';
import { ChatPopup } from 'component/chat/ChatPopup';
import { Icon } from 'component/Icon';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { UserProfile } from 'component/chat/UserProfile';
import { ICONS, NAME_PATTERN, EMAIL_PATTERN } from 'constants/shared';
import { shouldRenderErrorMessage, renderLabel } from 'src/util/fields';

import { locals as styles } from 'component/chat/ChatContactDetailsPopup.scss';

import {
  EDIT_CONTACT_DETAILS_SCREEN,
  EDIT_CONTACT_DETAILS_LOADING_SCREEN,
  EDIT_CONTACT_DETAILS_ERROR_SCREEN
} from 'constants/chat';

export class ChatContactDetailsPopup extends Component {
  static propTypes = {
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    screen: PropTypes.string.isRequired,
    visitor: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    className: PropTypes.string,
    contactDetails: PropTypes.object,
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func,
    tryAgainFn: PropTypes.func,
    updateFn: PropTypes.func,
    show: PropTypes.bool,
    isMobile: PropTypes.bool,
    isAuthenticated: PropTypes.bool
  }

  static defaultProps = {
    className: '',
    contactDetails: {},
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    tryAgainFn: () => {},
    updateFn: () => {},
    show: false,
    isMobile: false,
    isAuthenticated: false
  }

  constructor(props) {
    super(props);
    const email = props.contactDetails.email || _.get(props.visitor, 'email', '');
    const name = props.contactDetails.display_name || _.get(props.visitor, 'display_name', '');

    this.props.updateFn(
      isDefaultNickname(name) ? '' : name,
      email
    );

    this.state = {
      showNameError: !nameValid(name, {
        allowEmpty: true
      }),
      showEmailError: !emailValid(email, {
        allowEmpty: true
      })
    };

    this.form = null;
  }

  componentWillReceiveProps(nextProps) {
    // Check if the ContactDetails values are null, if so, use the stored Visitor info instead
    const { display_name: nextName, email: nextEmail } = nextProps.contactDetails;
    const visitorName = _.get(nextProps.visitor, 'display_name', '');
    const visitorEmail = _.get(nextProps.visitor, 'email', '');

    if (_.isNil(nextName) && _.isNil(nextEmail)) {
      this.props.updateFn(visitorName, visitorEmail);
    }
    else if (isDefaultNickname(nextName)) {
      this.props.updateFn('', nextEmail);
    }
  }

  handleSave = () => {
    const { display_name: name, email } = this.props.contactDetails;
    const isNameError = !nameValid(name, {
      allowEmpty: true
    });
    const isEmailError = !emailValid(email, {
      allowEmpty: true
    });

    if (isNameError || isEmailError) {
      this.setState({
        showNameError: isNameError,
        showEmailError: isEmailError
      });
      return;
    }

    this.props.rightCtaFn(name, email);

    if (doc.activeElement) {
      doc.activeElement.blur();
    }
  }

  handleKeyPress = (e) => {
    if (e.charCode === keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault();
      this.handleSave();
    }
  }

  handleFormChange = (e) => {
    const { name, value } = e.target;
    const newState = {
      ...this.props.contactDetails,
      [name]: value
    };

    // We only want this to clear an existing error
    if (this.state.showNameError) {
      this.setState({
        showNameError: !nameValid(name, { alloweEmpty: true })
      });
    }

    if (this.state.showEmailError) {
      this.setState({
        showEmailError: !emailValid(newState.email, { allowEmpty: true })
      });
    }

    this.props.updateFn(
      newState.display_name,
      newState.email,
    );
  }

  renderTitle = () => {
    const title = i18n.t('embeddable_framework.chat.options.editContactDetails');

    return <h4 className={styles.title}>{title}</h4>;
  }

  renderErrorMessage(value, required, isError, errorString, pattern) {
    if (shouldRenderErrorMessage(value, required, isError, pattern)) {
      return <Message validation='error'>{i18n.t(errorString)}</Message>;
    }
    return null;
  }

  renderNameField = () => {
    const value = (_.isNil(this.props.contactDetails.display_name))
      ? '' : this.props.contactDetails.display_name;
    const error = this.renderErrorMessage(value,
      false,
      this.state.showNameError,
      'embeddable_framework.validation.error.name',
      NAME_PATTERN);

    return (
      <TextField>
        {renderLabel(Label, i18n.t('embeddable_framework.common.textLabel.name'), false)}
        <Input
          defaultValue={value}
          name='display_name'
          autoComplete='off'
          onKeyPress={this.handleKeyPress}
          validation={error ? 'error' : 'none'}
          pattern={NAME_PATTERN.source}
          disabled={this.props.isAuthenticated} />
        {error}
      </TextField>
    );
  }

  renderEmailField = () => {
    const value = (_.isNil(this.props.contactDetails.email))
      ? '' : this.props.contactDetails.email;
    const error = this.renderErrorMessage(value,
      false,
      this.state.showEmailError,
      'embeddable_framework.validation.error.email',
      EMAIL_PATTERN);

    /* eslint-disable max-len */
    return (
      <TextField>
        {renderLabel(Label, i18n.t('embeddable_framework.common.textLabel.email'), false)}
        <Input
          defaultValue={value}
          disabled={this.props.isAuthenticated}
          name='email'
          onKeyPress={this.handleKeyPress}
          validation={error ? 'error' : 'none'}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" />
        {error}
      </TextField>
    );
    /* eslint-enable max-len */
  }

  renderUserProfile() {
    const {
      authUrls,
      socialLogin,
      visitor,
      initiateSocialLogout
    } = this.props;
    // isAuthenticated

    return (
      <UserProfile
        authUrls={authUrls}
        socialLogin={socialLogin}
        visitor={visitor}
        initiateSocialLogout={initiateSocialLogout}
        isAuthenticated={false}
        nameField={this.renderNameField()}
        emailField={this.renderEmailField()} />
    );
  }

  renderFailureScreen = () => {
    if (this.props.screen !== EDIT_CONTACT_DETAILS_ERROR_SCREEN) return null;

    const failureMessageLabel = i18n.t('embeddable_framework.common.notify.error.generic');

    return (
      <div className={styles.resultContainer}>
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>
            <Icon type={ICONS.ERROR_FILL} />
          </div>
          <div className={styles.resultMessage}>
            {failureMessageLabel}
          </div>
        </div>
      </div>
    );
  }

  renderForm = () => {
    if (this.props.screen !== EDIT_CONTACT_DETAILS_SCREEN) return null;

    return (
      <div className={styles.popupChildrenContainer}>
        <form
          ref={(element) => this.form = element}
          className={styles.form}
          noValidate={true}
          onChange={this.handleFormChange}>
          {this.renderTitle()}
          {this.renderUserProfile()}
        </form>
      </div>
    );
  }

  renderLoadingSpinner() {
    if (this.props.screen !== EDIT_CONTACT_DETAILS_LOADING_SCREEN) return null;

    return (
      <LoadingSpinner
        height={32}
        width={32}
        className={styles.loadingSpinner} />
    );
  }

  render = () => {
    const { isMobile, className, leftCtaFn, screen, isAuthenticated } = this.props;
    const isLoading = (screen === EDIT_CONTACT_DETAILS_LOADING_SCREEN);
    const containerClasses = (isLoading) ? styles.popupChildrenContainerLoading : '';

    return (
      <ChatPopup
        isMobile={isMobile}
        useOverlay={isMobile}
        className={className}
        containerClasses={containerClasses}
        showCta={screen === EDIT_CONTACT_DETAILS_SCREEN}
        show={this.props.show}
        showOnlyLeftCta={isAuthenticated}
        leftCtaFn={leftCtaFn}
        leftCtaLabel={i18n.t('embeddable_framework.common.button.cancel')}
        rightCtaFn={this.handleSave}
        rightCtaLabel={i18n.t('embeddable_framework.common.button.save')}>
        {this.renderForm()}
        {this.renderFailureScreen()}
        {this.renderLoadingSpinner()}
      </ChatPopup>
    );
  }
}
