import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChatPopup } from 'component/chat/ChatPopup';
import { EmailField } from 'component/field/EmailField';
import { i18n } from 'service/i18n';
import { EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
         EMAIL_TRANSCRIPT_FAILURE_SCREEN,
         EMAIL_TRANSCRIPT_SCREEN,
         EMAIL_TRANSCRIPT_LOADING_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import { ICONS } from 'constants/shared';
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
    const email = _.get(props.visitor, 'email', '');

    this.state = {
      valid: emailValid(email),
      formState: {
        email
      }
    };

    this.form = null;
  }

  componentWillReceiveProps(nextProps) {
    const email = _.get(nextProps.visitor, 'email', '');

    this.setState({
      formState: { email }
    });
  }

  handleSave = (e) => {
    e.preventDefault();
    this.props.rightCtaFn(this.state.formState.email);
    const email = _.get(this.props.visitor, 'email', '');

    this.setState({
      valid: emailValid(email),
      formState: { email }
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
    const title = i18n.t('embeddable_framework.chat.emailtranscript.title');

    return <h4 className={styles.title}>{title}</h4>;
  }

  renderEmailField = () => {
    return (
      <EmailField
        fieldContainerClasses={styles.fieldContainer}
        fieldClasses={styles.field}
        labelClasses={styles.fieldLabel}
        label={i18n.t('embeddable_framework.form.field.email.label')}
        value={this.state.formState.email}
        name='email' />
    );
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

  renderSuccessScreen = () => {
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_SUCCESS_SCREEN) return null;

    const successLabel = i18n.t('embeddable_framework.chat.emailtranscript.success_message',
                                { email: `<b>${this.props.emailTranscript.email}</b>` });

    return (
      <div className={`${styles.resultScreen}`}>
        <div>
          <Icon type='Icon--checkmark-fill'/>
        </div>
        <div dangerouslySetInnerHTML={{__html: successLabel}} />
      </div>
    );
  }

  renderFailureScreen = () => {
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_FAILURE_SCREEN) return null;

    const failureMessageLabel = i18n.t('embeddable_framework.chat.emailtranscript.failure_message');
    const tryAgainLabel = i18n.t('embeddable_framework.chat.emailtranscript.try_again');

    return (
      <div className={`${styles.resultScreen}`}>
        <div>
          <Icon type={ICONS.ERROR_FILL} />
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
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_LOADING_SCREEN) return null;

    const spinnerIEClasses = isIE() ? styles.loadingSpinnerIE : '';

    return (
      <div className={`${styles.loadingSpinner} ${spinnerIEClasses}`}>
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
      if (this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_FAILURE_SCREEN ||
          this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_SUCCESS_SCREEN) {
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
        rightCtaLabel={i18n.t('embeddable_framework.common.button.send')}
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
