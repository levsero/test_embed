import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChatPopup } from 'component/chat/ChatPopup';
import { Field } from 'component/field/Field';
import { i18n } from 'service/i18n';
import { EMAIL_TRANSCRIPT_IDLE,
         EMAIL_TRANSCRIPT_SUCCESS,
         EMAIL_TRANSCRIPT_FAILURE,
         EMAIL_TRANSCRIPT_REQUEST_SENT } from 'src/redux/modules/chat/chat-action-types';
import { locals as styles } from 'component/chat/ChatEmailTranscriptPopup.scss';
import { emailValid } from 'src/util/utils';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { Icon } from 'src/component/Icon';
import { isIE } from 'utility/devices';

import _ from 'lodash';

export class ChatEmailTranscriptPopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func,
    visitor: PropTypes.object,
    emailTranscript: PropTypes.object,
    tryEmailTranscriptAgain: PropTypes.func
  }

  static defaultProps = {
    className: '',
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    visitor: {},
    emailTranscript: {},
    tryEmailTranscriptAgain: () => {}
  }

  constructor(props) {
    super(props);
    const email = _.get(props.visitor, 'email', '');

    this.state = {
      valid: emailValid(email),
      formState: {
        email
      },
      isResultTextMultiLine: false
    };

    this.form = null;
    this.resultContainer = null;
  }

  componentDidUpdate= (prevProps, prevState) => {
    if (this.resultContainer &&
        this.resultContainer.clientHeight > styles.resultGridMinHeight &&
        !prevState.isResultTextMultiLine) {
      this.setState({ isResultTextMultiLine: true });
    } else if (this.resultContainer &&
                this.resultContainer.clientHeight <= styles.resultGridMinHeight &&
                prevState.isResultTextMultiLine) {
      this.setState({ isResultTextMultiLine: false });
    }
  };

  handleSave = (e) => {
    e.preventDefault();
    this.props.rightCtaFn(this.state.formState.email);
    this.setState({
      valid: false,
      formState: {
        email: ''
      }
    });
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
    const title = i18n.t(
      'embeddable_framework.chat.emailTranscript.title',
      { fallback: 'Email chat transcript' }
    );

    return <h4 className={styles.title}>{title}</h4>;
  }

  renderEmailField = () => {
    return (
      <Field
        fieldContainerClasses={styles.fieldContainer}
        fieldClasses={styles.field}
        placeholder={i18n.t('embeddable_framework.common.textLabel.email', { fallback: 'Email' })}
        required={true}
        value={this.state.formState.email}
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
        name='email' />
    );
  }

  renderFormScreen = () => {
    if (this.props.emailTranscript.status !== EMAIL_TRANSCRIPT_IDLE) return null;

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

  renderSuccessScreen = () => {
    if (this.props.emailTranscript.status !== EMAIL_TRANSCRIPT_SUCCESS) return null;

    const fallback = `Email will be sent to <b>${this.props.emailTranscript.email}</b> when the chat ends`;
    const successLabel = i18n.t('embeddable_framework.chat.emailtranscript.success_message',
                                { fallback, email: this.props.emailTranscript.email });
    const multiLineStyle = this.state.isResultTextMultiLine
                          ? styles.resultScreenMultiLine
                          : styles.resultScreenSingleLine;

    return (
      <div className={multiLineStyle} ref={(resultContainer) => {this.resultContainer = resultContainer;}}>
        <div>
          <Icon type='Icon--checkmark-fill'/>
        </div>
        <div dangerouslySetInnerHTML={{__html: successLabel}} />
      </div>
    );
  }

  renderFailureScreen = () => {
    if (this.props.emailTranscript.status !== EMAIL_TRANSCRIPT_FAILURE) return null;

    const failureMessageLabel = i18n.t('embeddable_framework.chat.emailtranscript.failure_message',
                                       { fallback: 'Unable to send transcript.' });
    const tryAgainLabel = i18n.t('embeddable_framework.chat.emailtranscript.failure_message',
                                 { fallback: 'Try again.' });
    const multiLineStyle = this.state.isResultTextMultiLine
                          ? styles.resultScreenMultiLine
                          : styles.resultScreenSingleLine;

    return (
      <div className={multiLineStyle} ref={(resultContainer) => {this.resultContainer = resultContainer;}}>
        <div>
          <Icon type='Icon--error-fill'/>
        </div>
        <div>
          {failureMessageLabel}
          <br />
          <a onClick={this.props.tryEmailTranscriptAgain}>{tryAgainLabel}</a>
        </div>
      </div>
    );
  }

  renderLoadingScreen = () => {
    if (this.props.emailTranscript.status !== EMAIL_TRANSCRIPT_REQUEST_SENT) return null;

    const spinnerIEClasses = isIE() ? styles.loadingSpinnerIE : '';

    return (
      <div className={`${styles.loadingSpinner} ${spinnerIEClasses}`}>
        <LoadingSpinner />
      </div>
    );
  }

  render = () => {
    const { className, leftCtaFn } = this.props;
    const isEmailTranscriptResult = this.props.emailTranscript.status === EMAIL_TRANSCRIPT_SUCCESS ||
                                    this.props.emailTranscript.status === EMAIL_TRANSCRIPT_FAILURE;
    let childrenContainerClasses = isEmailTranscriptResult ?
                                  styles.resultContainer : styles.childrenContainer;

    if (this.props.emailTranscript.status === EMAIL_TRANSCRIPT_REQUEST_SENT) {
      childrenContainerClasses = styles.loadingContainer;
    }

    return (
      <ChatPopup
        showCta={this.props.emailTranscript.status===EMAIL_TRANSCRIPT_IDLE}
        className={className}
        leftCtaFn={leftCtaFn}
        leftCtaLabel={i18n.t('embeddable_framework.common.button.cancel')}
        rightCtaFn={this.handleSave}
        rightCtaLabel={i18n.t('embeddable_framework.common.button.send', { fallback: 'Send' })}
        rightCtaDisabled={!this.state.valid}>
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
