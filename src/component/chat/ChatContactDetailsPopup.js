import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { TextField, Label, Input, Message } from '@zendeskgarden/react-textfields';

import { keyCodes } from 'utility/keyboard';
import { document as doc } from 'utility/globals';
import { i18n } from 'service/i18n';
import { emailValid } from 'src/util/utils';
import { isDefaultNickname } from 'src/util/chat';
import { ChatPopup } from 'component/chat/ChatPopup';
import { Icon } from 'component/Icon';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { ICONS, EMAIL_PATTERN } from 'constants/shared';
import { shouldRenderErrorMessage, renderLabelText } from 'src/util/fields';

import { locals as styles } from 'component/chat/ChatContactDetailsPopup.scss';

import {
  EDIT_CONTACT_DETAILS_SCREEN,
  EDIT_CONTACT_DETAILS_LOADING_SCREEN,
  EDIT_CONTACT_DETAILS_ERROR_SCREEN
} from 'constants/chat';

export class ChatContactDetailsPopup extends Component {
  static propTypes = {
    screen: PropTypes.string.isRequired,
    className: PropTypes.string,
    contactDetails: PropTypes.object,
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func,
    tryAgainFn: PropTypes.func,
    show: PropTypes.bool,
    isMobile: PropTypes.bool,
    visitor: PropTypes.object,
    isAuthenticated: PropTypes.bool
  }

  static defaultProps = {
    className: '',
    contactDetails: {},
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    tryAgainFn: () => {},
    show: false,
    isMobile: false,
    visitor: {},
    isAuthenticated: false
  }

  constructor(props) {
    super(props);
    const email = props.contactDetails.email || _.get(props.visitor, 'email', '');
    const name = props.contactDetails.display_name || _.get(props.visitor, 'display_name', '');

    this.state = {
      valid: emailValid(email, { allowEmpty: true }),
      formState: {
        email,
        name: isDefaultNickname(name) ? '' : name
      },
      showErrors: false
    };

    this.form = null;
  }

  componentWillReceiveProps(nextProps) {
    // The component state must be shown first because it the user's typed values that have
    // not been saved yet. If this does not exist yet, then we must show the previously submitted
    // contact details. If this does not exist either, then we must show any existing visitor info
    // details we have (eg. this can be sourced via zE.identify()).
    const email = this.state.formState.email || nextProps.contactDetails.email || _.get(nextProps.visitor, 'email', '');
    const name = this.state.formState.name ||
      nextProps.contactDetails.display_name ||
      _.get(nextProps.visitor, 'display_name', '');

    this.setState({
      valid: emailValid(email, { allowEmpty: true }),
      formState: {
        email,
        name: isDefaultNickname(name) ? '' : name
      }
    });
  }

  handleSave = () => {
    const { name, email } = this.state.formState;

    if (!this.state.valid) {
      this.setState({ showErrors: true });
      return;
    }

    this.props.rightCtaFn(name, email);

    this.setState({ showErrors: false });

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
    const fieldState = { [name]: value };

    this.setState({
      valid: this.form.checkValidity(),
      formState: { ...this.state.formState, ...fieldState }
    });
  }

  renderTitle = () => {
    const title = i18n.t('embeddable_framework.chat.options.editContactDetails');

    return <h4 className={styles.title}>{title}</h4>;
  }

  renderErrorMessage(value, required, errorString, pattern) {
    if (shouldRenderErrorMessage(value, required, this.state.showErrors, pattern)) {
      return <Message validation='error'>{i18n.t(errorString)}</Message>;
    }
    return null;
  }

  renderNameField = () => {
    const value = this.state.formState.name;
    const error = this.renderErrorMessage(value, false, 'embeddable_framework.validation.error.name');
    const validationProps = error ? { validation: 'error' } : {};

    return (
      <TextField>
        <Label>
          {renderLabelText(i18n.t('embeddable_framework.common.textLabel.name'), false)}
        </Label>
        <Input
          value={value}
          name='name'
          autoComplete='off'
          onKeyPress={this.handleKeyPress}
          {...validationProps}
          disabled={this.props.isAuthenticated} />
        {error}
      </TextField>
    );
  }

  renderEmailField = () => {
    const value = this.state.formState.email;
    const error = this.renderErrorMessage(value,
      false, 'embeddable_framework.validation.error.email', EMAIL_PATTERN);
    const validationProps = error ? { validation: 'error' } : {};

    return (
      <TextField>
        <Label>
          {renderLabelText(i18n.t('embeddable_framework.common.textLabel.email'), false)}
        </Label>
        <Input
          value={this.state.formState.email}
          type='email'
          disabled={this.props.isAuthenticated}
          name='email'
          onKeyPress={this.handleKeyPress}
          {...validationProps} />
        {error}
      </TextField>
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
          {this.renderNameField()}
          {this.renderEmailField()}
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
