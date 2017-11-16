import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'component/form/Form';
import { Field } from 'component/field/Field';
import { Icon } from 'component/Icon';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';

import { CALL_ME_SCREEN, SUCCESS_NOTIFICATION_SCREEN } from 'src/redux/modules/talk/talk-screen-types';
import { http } from 'service/transport';
import { i18n } from 'service/i18n';

import { locals as styles } from './Talk.sass';

export class Talk extends Component {
  static propTypes = {
    talkConfig: PropTypes.object.isRequired,
    zendeskSubdomain: PropTypes.string.isRequired,
    getFrameDimensions: PropTypes.func.isRequired,
    hideZendeskLogo: PropTypes.bool,
    updateFrameSize: PropTypes.func,
    formTitleKey: PropTypes.string
  };

  static defaultProps = {
    hideZendeskLogo: false,
    updateFrameSize: () => {},
    formTitleKey: ''
  };

  constructor() {
    super();

    this.state = {
      formState: {},
      currentScreen: CALL_ME_SCREEN,
      phoneNumber: ''
    };

    this.form = null;
  }

  clearNotification = () => {
    this.setState({ currentScreen: CALL_ME_SCREEN });
  }

  handleFormCompleted = (formState) => {
    const { serviceUrl, keyword } = this.props.talkConfig;
    const params = {
      phoneNumber: formState.phone,
      subdomain: this.props.zendeskSubdomain,
      keyword
    };
    const callbacks = {
      done: (res) => {
        this.form.clear();
        this.setState({
          currentScreen: SUCCESS_NOTIFICATION_SCREEN,
          phoneNumber: res.body.phone_number
        });
      }
    };

    http.callMeRequest(serviceUrl, {
      params,
      callbacks
    });
  }

  handleFormChange = (formState) => {
    this.setState({ formState });
  }

  renderFormHeader = () => {
    const headerMessage = i18n.t('embeddable_framework.talk.form.headerMessage', {
      fallback: 'Enter your phone number and we\'ll call you as soon as we can.'
    });

    return <p>{headerMessage}</p>;
  }

  renderPhoneField = () => {
    return (
      <Field
        label={i18n.t('embeddable_framework.common.textLabel.phoneNumber', { fallback: 'Phone Number' })}
        required={true}
        value={this.state.formState.phone}
        name='phone' />
    );
  }

  renderFormScreen = () => {
    if (this.state.currentScreen !== CALL_ME_SCREEN) return;

    return (
      <Form
        ref={(el) => this.form = el}
        submitButtonLabel={i18n.t('embeddable_framework.talk.button.callMe', { fallback: 'Call me' })}
        rtl={i18n.isRTL()}
        onCompleted={this.handleFormCompleted}
        onChange={this.handleFormChange}>
        {this.renderFormHeader()}
        {this.renderPhoneField()}
      </Form>
    );
  }

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo) return;

    return <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />;
  }

  renderSuccessNotificationScreen = () => {
    if (this.state.currentScreen !== SUCCESS_NOTIFICATION_SCREEN) return;

    const message = i18n.t('embeddable_framework.talk.notify.success.message', {
      fallback: `Thanks for submiting your request. We'll get back to you soon on ${this.state.phoneNumber}`
    });
    const iconClasses = `${styles.notifyIcon} u-userFillColor u-userTextColor`;

    return (
      <div>
        <p className={styles.notifyMessage}>{message}</p>
        <div className={styles.notify}>
          <Icon type='Icon--tick' className={iconClasses} />
        </div>
      </div>
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    const formTitle = i18n.t(`embeddable_framework.talk.form.title.${this.props.formTitleKey}`, {
      fallback: 'We\'ll call you'
    });
    const successNotificationTitle = i18n.t('embeddable_framework.talk.notify.success.title', {
      fallback: 'Request sent'
    });
    const onCallMeScreen = this.state.currentScreen === CALL_ME_SCREEN;
    const title = onCallMeScreen ? formTitle : successNotificationTitle;
    const footerClasses = onCallMeScreen ? styles.footer : '';

    return (
      <ScrollContainer
        ref='scrollContainer'
        hideZendeskLogo={this.props.hideZendeskLogo}
        footerClasses={footerClasses}
        footerContent={this.renderZendeskLogo()}
        getFrameDimensions={this.props.getFrameDimensions}
        title={title}>
        {this.renderFormScreen()}
        {this.renderSuccessNotificationScreen()}
      </ScrollContainer>
    );
  }
}
