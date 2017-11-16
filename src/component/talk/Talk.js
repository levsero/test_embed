import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'component/form/Form';
import { Field } from 'component/field/Field';
import { Icon } from 'component/Icon';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';

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
      showSuccessNotification: false,
      successNotificationMessage: ''
    };

    this.form = null;
  }

  clearNotification = () => {
    this.setState({ showSuccessNotification: false });
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
        const message = i18n.t('embeddable_framework.talk.notify.success.message', {
          fallback: `Thanks for submiting your request. We'll get back to you soon on ${res.body.phone_number}`
        });

        this.form.clear();

        this.setState({
          showSuccessNotification: true,
          successNotificationMessage: message
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

  renderForm = () => {
    return (
      <Form
        ref={(el) => this.form = el}
        submitButtonLabel={i18n.t('embeddable_framework.talk.button.callMe', { fallback: 'Call me' })}
        rtl={i18n.isRTL()}
        onFormCompleted={this.handleFormCompleted}
        onFormChange={this.handleFormChange}>
        {this.renderFormHeader()}
        {this.renderPhoneField()}
      </Form>
    );
  }

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo) return null;

    return <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />;
  }

  renderSuccessNotification = () => {
    const iconClasses = `${styles.notifyIcon} u-userFillColor u-userTextColor`;

    return (
      <div>
        <p className={styles.notifyMessage}>{this.state.successNotificationMessage}</p>
        <div className={styles.notify}>
          <Icon type='Icon--tick' className={iconClasses} />
        </div>
      </div>
    );
  }

  renderBody = () => {
    return this.state.showSuccessNotification
         ? this.renderSuccessNotification()
         : this.renderForm();
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    const successNotificationTitle = i18n.t('embeddable_framework.talk.notify.success.title', {
      fallback: 'Request sent'
    });
    const formTitle = i18n.t(`embeddable_framework.talk.form.title.${this.props.formTitleKey}`, {
      fallback: 'We\'ll call you'
    });
    const title = this.state.showSuccessNotification ? successNotificationTitle : formTitle;
    const footerClasses = !this.state.showSuccessNotification ? styles.footer : '';

    return (
      <ScrollContainer
        ref='scrollContainer'
        hideZendeskLogo={this.props.hideZendeskLogo}
        footerClasses={footerClasses}
        footerContent={this.renderZendeskLogo()}
        getFrameDimensions={this.props.getFrameDimensions}
        title={title}>
        {this.renderBody()}
      </ScrollContainer>
    );
  }
}
