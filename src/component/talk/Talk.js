import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'component/form/Form';
import { Field } from 'component/field/Field';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';

import { http } from 'service/transport';
import { i18n } from 'service/i18n';

import { locals as styles } from './Talk.sass';

export class Talk extends Component {
  static propTypes = {
    talkServiceUrl: PropTypes.string.isRequired,
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
      formState: {}
    };
  }

  handleFormCompleted = (formState) => {
    const params = {
      phoneNumber: formState.phone,
      subdomain: this.props.zendeskSubdomain
    };
    const callbacks = {
      done: (res) => { debugger }
    };

    http.callMeRequest(this.props.talkServiceUrl, {
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

    return (
      <div>
        <p>{headerMessage}</p>
      </div>
    );
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
        submitButtonLabel={i18n.t('embeddable_framework.talk.button.callMe', { fallback: 'Call me' })}
        onFormCompleted={this.handleFormCompleted}
        onFormChange={this.handleFormChange}>
        {this.renderPhoneField()}
      </Form>
    );
  }

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo) return null;

    return <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />;
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    const title = i18n.t(`embeddable_framework.talk.form.title.${this.props.formTitleKey}`, {
      fallback: 'We\'ll call you'
    });

    return (
      <ScrollContainer
        ref='scrollContainer'
        hideZendeskLogo={this.props.hideZendeskLogo}
        footerClasses={styles.footer}
        footerContent={this.renderZendeskLogo()}
        getFrameDimensions={this.props.getFrameDimensions}
        title={title}>
        {this.renderFormHeader()}
        {this.renderForm()}
      </ScrollContainer>
    );
  }
}
