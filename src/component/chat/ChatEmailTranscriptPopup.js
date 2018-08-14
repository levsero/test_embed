import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { keyCodes } from 'utility/keyboard';
import { shouldRenderErrorMessage, renderLabelText } from 'src/util/fields';
import { ChatPopup } from 'component/chat/ChatPopup';
import { i18n } from 'service/i18n';
import { EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
  EMAIL_TRANSCRIPT_FAILURE_SCREEN,
  EMAIL_TRANSCRIPT_SCREEN,
  EMAIL_TRANSCRIPT_LOADING_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import { ICONS, EMAIL_PATTERN } from 'constants/shared';
import { locals as styles } from 'component/chat/ChatEmailTranscriptPopup.scss';
import { emailValid } from 'src/util/utils';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { TextField, Label, Input, Message } from '@zendeskgarden/react-textfields';
import { Icon } from 'src/component/Icon';
import _ from 'lodash';

export class ChatEmailTranscriptPopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func,
    visitor: PropTypes.object,
    emailTranscript: PropTypes.object,
    tryEmailTranscriptAgain: PropTypes.func,
    show: PropTypes.bool,
    isMobile: PropTypes.bool,
    resetEmailTranscript: PropTypes.func
  }

  static defaultProps = {
    className: '',
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    visitor: {},
    emailTranscript: {},
    tryEmailTranscriptAgain: () => {},
    show: false,
    isMobile: false,
    resetEmailTranscript: () => {}
  }

  constructor(props) {
    super(props);
    const email = props.emailTranscript.email || _.get(props.visitor, 'email', '');

    this.state = {
      valid: emailValid(email),
      formState: {
        email
      },
      showErrors: false
    };

    this.form = null;
  }

  componentWillReceiveProps(nextProps) {
    const email = nextProps.emailTranscript.email || _.get(nextProps.visitor, 'email', '');

    this.setState({
      formState: { email }
    });
  }

  handleSave = (e) => {
    const email = this.props.emailTranscript.email || _.get(this.props.visitor, 'email', '');

    e.preventDefault();

    if (!this.state.valid) {
      this.setState({ showErrors: true });
      return;
    }

    this.props.rightCtaFn(this.state.formState.email);

    this.setState({
      valid: emailValid(email),
      formState: { email },
      showErrors: false
    });
  }

  handleKeyPress = (e) => {
    if (e.charCode === keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault();
      this.handleSave(e);
    }
  }

  handleFormChange = (e) => {
    const { name, value } = e.target;
    const fieldState = { [name]: value };

    this.setState({
      valid: emailValid(fieldState.email),
      formState: { ...this.state.formState, ...fieldState }
    });
  }

  renderTitle = () => {
    const title = i18n.t('embeddable_framework.chat.emailtranscript.title');

    return <h4 className={styles.title}>{title}</h4>;
  }

  renderEmailField = () => {
    const value = this.state.formState.email;
    const error = shouldRenderErrorMessage(value, true, this.state.showErrors, EMAIL_PATTERN)
      ? <Message validation='error'>{i18n.t('embeddable_framework.validation.error.email')}</Message>
      : null;

    /* eslint-disable max-len */
    return (
      <TextField>
        <Label>
          {renderLabelText(i18n.t('embeddable_framework.common.textLabel.email'), true)}
        </Label>
        <Input
          required={true}
          value={this.state.formState.email}
          onKeyPress={this.handleKeyPress}
          name='email'
          validation={error ? 'error' : 'none'}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" />
        {error}
      </TextField>
    );
    /* eslint-enable max-len */
  }

  renderFormScreen = () => {
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_SCREEN) return null;

    return (
      <form
        ref={(element) => this.form = element}
        className={styles.form}
        noValidate={true}
        onChange={this.handleFormChange}
        onSubmit={(e) => {e.preventDefault();}}>
        {this.renderTitle()}
        {this.renderEmailField()}
      </form>
    );
  }

  renderResultScreen = (resultContent, iconType = 'Icon--checkmark-fill') => {
    return (
      <div className={styles.resultScreen}>
        <div className={styles.resultIcon}>
          <Icon type={iconType} />
        </div>
        {resultContent}
      </div>
    );
  }

  renderSuccessScreen = () => {
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_SUCCESS_SCREEN) return null;

    const successLabel = i18n.t(
      'embeddable_framework.chat.emailtranscript.success_message',
      { email: `<strong>${this.props.emailTranscript.email}</strong>` }
    );
    const message = <div className={styles.resultMessage} dangerouslySetInnerHTML={{__html: successLabel}} />;

    return this.renderResultScreen(message);
  }

  renderFailureScreen = () => {
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_FAILURE_SCREEN) return null;

    const failureMessageLabel = i18n.t('embeddable_framework.chat.emailtranscript.failure_message');
    const tryAgainLabel = i18n.t('embeddable_framework.chat.emailtranscript.try_again');
    const message = (
      <div className={styles.resultMessage}>
        {failureMessageLabel}
        <br />
        <a className={styles.tryAgain} onClick={this.props.tryEmailTranscriptAgain}>{tryAgainLabel}</a>
      </div>
    );

    return this.renderResultScreen(message, ICONS.ERROR_FILL);
  }

  renderLoadingScreen = () => {
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_LOADING_SCREEN) return null;

    return (
      <div className={styles.loadingSpinner}>
        <LoadingSpinner />
      </div>
    );
  }

  render() {
    const { isMobile, className, leftCtaFn } = this.props;
    const isEmailTranscriptResult = this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_SUCCESS_SCREEN ||
                                    this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_FAILURE_SCREEN;
    let childrenContainerClasses = isEmailTranscriptResult
      ? styles.resultContainer : styles.childrenContainer;

    if (this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_LOADING_SCREEN) {
      childrenContainerClasses = styles.loadingContainer;
    }

    const onExited = () => {
      if (this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_SUCCESS_SCREEN) {
        this.props.resetEmailTranscript();
      }
    };

    return (
      <ChatPopup
        isMobile={isMobile}
        useOverlay={isMobile}
        onExited={onExited}
        showCta={this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_SCREEN}
        show={this.props.show}
        className={className}
        leftCtaFn={leftCtaFn}
        leftCtaLabel={i18n.t('embeddable_framework.common.button.cancel')}
        rightCtaFn={this.handleSave}
        rightCtaLabel={i18n.t('embeddable_framework.common.button.send')}>
        <div className={childrenContainerClasses}>
          {this.renderFormScreen()}
          {this.renderSuccessScreen()}
          {this.renderLoadingScreen()}
          {this.renderFailureScreen()}
        </div>
      </ChatPopup>
    );
  }
}
