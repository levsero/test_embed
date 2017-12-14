import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
const libphonenumber = require('libphonenumber-js');

import { Field } from 'component/field/Field';
import { TalkPhoneField } from 'component/talk/TalkPhoneField';
import { Form } from 'component/form/Form';
import { Icon } from 'component/Icon';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';

import {
  CALLBACK_ONLY_SCREEN,
  PHONE_ONLY_SCREEN,
  CALLBACK_AND_PHONE_SCREEN,
  SUCCESS_NOTIFICATION_SCREEN } from 'src/redux/modules/talk/talk-screen-types';
import { updateTalkCallbackForm,
         submitTalkCallbackForm } from 'src/redux/modules/talk';
import { getEmbeddableConfig,
         getAgentAvailability,
         getFormState,
         getScreen,
         getCallback,
         getAverageWaitTime } from 'src/redux/modules/talk/talk-selectors';
import { i18n } from 'service/i18n';

import { locals as styles } from './Talk.sass';

const mapStateToProps = (state) => {
  return {
    embeddableConfig: getEmbeddableConfig(state),
    agentAvailability: getAgentAvailability(state),
    formState: getFormState(state),
    screen: getScreen(state),
    phoneNumber: getCallback(state).phoneNumber,
    averageWaitTime: getAverageWaitTime(state)
  };
};

class Talk extends Component {
  static propTypes = {
    embeddableConfig: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    screen: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    averageWaitTime: PropTypes.string.isRequired,
    updateTalkCallbackForm: PropTypes.func.isRequired,
    submitTalkCallbackForm: PropTypes.func.isRequired,
    talkConfig: PropTypes.object.isRequired,
    zendeskSubdomain: PropTypes.string.isRequired,
    getFrameDimensions: PropTypes.func.isRequired,
    hideZendeskLogo: PropTypes.bool,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = {
    hideZendeskLogo: false,
    updateFrameSize: () => {},
    formState: { phone: '' },
    embeddableConfig: { phoneNumber: '' }
  };

  constructor() {
    super();
    this.form = null;
  }

  handleFormCompleted = (formState) => {
    const { serviceUrl, keyword } = this.props.talkConfig;

    this.props.submitTalkCallbackForm(formState, this.props.zendeskSubdomain, serviceUrl, keyword);
  }

  handleFormChange = (formState) => {
    this.props.updateTalkCallbackForm(formState);
  }

  formatPhoneNumber = (phoneNumber) => {
    return libphonenumber.format(phoneNumber, 'International');
  }

  renderAverageWaitTime = () => {
    const { averageWaitTime } = this.props;
    const waitTimeForm = parseInt(averageWaitTime, 10) > 1 ? 'Plural' : 'Singular';
    const waitTimeMessage = i18n.t(`embeddable_framework.talk.form.averageWaitTime${waitTimeForm}`, {
      fallback: `Average wait time: ${averageWaitTime}`,
      averageWaitTime
    });

    return <p>{waitTimeMessage}</p>;
  }

  renderFormHeader = () => {
    const headerMessage = i18n.t('embeddable_framework.talk.form.headerMessage', {
      fallback: 'Enter your phone number and we\'ll call you as soon as we can.'
    });

    return (
      <div>
        <p>{headerMessage}</p>
        <p>{this.renderAverageWaitTime()}</p>
      </div>
    );
  }

  renderFormScreen = () => {
    const phoneLabel = i18n.t(`embeddable_framework.common.textLabel.phone`, { fallback: 'Phone Number' });
    const nameLabel = i18n.t(`embeddable_framework.common.textLabel.name`, { fallback: 'Name' });
    const descriptionLabel = i18n.t(`embeddable_framework.common.textLabel.description`,
      { fallback: 'How can we help?' });
    let { phone, name, description } = this.props.formState;

    return (
      <Form
        ref={(el) => this.form = el}
        className={styles.form}
        submitButtonLabel={i18n.t('embeddable_framework.common.button.send', { fallback: 'Submit' })}
        rtl={i18n.isRTL()}
        onCompleted={this.handleFormCompleted}
        onChange={this.handleFormChange}>
        {this.renderFormHeader()}
        <div className={styles.formDivider} />
        <TalkPhoneField
          required={true}
          label={phoneLabel}
          value={phone} />
        <Field label={nameLabel}
          value={name}
          name='name' />
        <Field
          label={descriptionLabel}
          value={description}
          input={<textarea rows='3' />}
          name='description' />
      </Form>
    );
  }

  renderPhoneFormScreen = () => {
    const phoneLabel = i18n.t('embeddable_framework.talk.label.phoneDisplay', { fallback: 'Our phone number:' });

    return (
      <div>
        <div className={styles.phoneDisplayLabel}>
          {`${phoneLabel} ${this.props.embeddableConfig.phoneNumber}`}
        </div>
        {this.renderFormScreen()}
      </div>
    );
  }

  renderPhoneOnlyScreen = () => {
    const message = i18n.t(
      'embeddable_framework.talk.phoneOnly.message',
      { fallback: 'Call the phone number below to get in contact with us.' }
    );
    const phoneNumber = this.formatPhoneNumber(this.props.embeddableConfig.phoneNumber);

    return (
      <div className={styles.phoneOnlyContainer}>
        <p className={styles.phoneOnlyMessage}>{message}</p>
        <p>{this.renderAverageWaitTime()}</p>
        <div className={styles.phoneNumber}>{phoneNumber}</div>
      </div>
    );
  }

  renderSuccessNotificationScreen = () => {
    const displayNumber = this.formatPhoneNumber(this.props.phoneNumber);
    const message = i18n.t('embeddable_framework.talk.notify.success.message', {
      fallback: `Thanks for submiting your request. We'll get back to you soon on ${displayNumber}`,
      displayNumber
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

  renderContent = () => {
    switch (this.props.screen) {
      case CALLBACK_ONLY_SCREEN:
        return this.renderFormScreen();
      case PHONE_ONLY_SCREEN:
        return this.renderPhoneOnlyScreen();
      case SUCCESS_NOTIFICATION_SCREEN:
        return this.renderSuccessNotificationScreen();
      case CALLBACK_AND_PHONE_SCREEN:
        return this.renderPhoneFormScreen();
      default:
        return null;
    }
  }

  renderFormTitle = () => {
    const formTitle = i18n.t(
      'embeddable_framework.talk.form.title',
      { fallback: 'Request a callback' }
    );
    const phoneOnlyTitle = i18n.t(
      'embeddable_framework.talk.phoneOnly.title',
      { fallback: 'Call us' }
    );
    const successNotificationTitle = i18n.t(
      'embeddable_framework.talk.notify.success.title',
      { fallback: 'Request sent' }
    );

    switch (this.props.screen) {
      case SUCCESS_NOTIFICATION_SCREEN:
        return successNotificationTitle;
      case PHONE_ONLY_SCREEN:
        return phoneOnlyTitle;
      case CALLBACK_ONLY_SCREEN:
      case CALLBACK_AND_PHONE_SCREEN:
      default:
        return formTitle;
    }
  }

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo) return;

    return <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />;
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    const footerClasses = !(this.props.screen === SUCCESS_NOTIFICATION_SCREEN) ? styles.footer : '';

    return (
      <ScrollContainer
        ref='scrollContainer'
        containerClasses={styles.scrollContainer}
        hideZendeskLogo={this.props.hideZendeskLogo}
        footerClasses={footerClasses}
        footerContent={this.renderZendeskLogo()}
        getFrameDimensions={this.props.getFrameDimensions}
        title={this.renderFormTitle()}>
        {this.renderContent()}
      </ScrollContainer>
    );
  }
}

const actionCreators = {
  updateTalkCallbackForm,
  submitTalkCallbackForm
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Talk);
