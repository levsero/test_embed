import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Field } from 'component/field/Field';
import { EmailField } from 'component/field/EmailField';
import { TalkPhoneField } from 'component/talk/TalkPhoneField';
import { Form } from 'component/form/Form';
import { Icon } from 'component/Icon';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';

import {
  CALLBACK_ONLY_SCREEN,
  CALLBACK_AND_PHONE_SCREEN,
  SUCCESS_NOTIFICATION_SCREEN } from 'src/redux/modules/talk/talk-screen-types';
import { updateTalkScreen, updateTalkCallMeForm, updateTalkPhoneNumber } from 'src/redux/modules/talk';
import { getEmbeddableConfig,
         getAgentAvailability,
         getFormState,
         getScreen,
         getPhoneNumber,
         getAverageWaitTime } from 'src/redux/modules/talk/talk-selectors';
import { http } from 'service/transport';
import { i18n } from 'service/i18n';

import { locals as styles } from './Talk.sass';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    embeddableConfig: getEmbeddableConfig(state),
    agentAvailbility: getAgentAvailability(state),
    formState: getFormState(state),
    screen: getScreen(state),
    phoneNumber: getPhoneNumber(state),
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
    updateTalkScreen: PropTypes.func.isRequired,
    updateTalkCallMeForm: PropTypes.func.isRequired,
    updateTalkPhoneNumber: PropTypes.func.isRequired,
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
    const additionalInfo = _.pickBy({
      email: formState.email,
      name: formState.name,
      description: formState.description
    }, _.identify);
    const params = {
      phoneNumber: formState.phone,
      subdomain: this.props.zendeskSubdomain,
      additional_info: additionalInfo, // eslint-disable-line camelcase
      keyword
    };
    const callbacks = {
      done: (res) => {
        this.form.clear();
        this.props.updateTalkScreen(SUCCESS_NOTIFICATION_SCREEN);
        this.props.updateTalkPhoneNumber(res.body.phone_number);
      }
    };

    http.callMeRequest(serviceUrl, {
      params,
      callbacks
    });
  }

  handleFormChange = (formState) => {
    this.props.updateTalkCallMeForm(formState);
  }

  renderFormHeader = () => {
    const { averageWaitTime } = this.props;
    const waitTimeForm = parseInt(averageWaitTime, 10) > 1 ? 'Plural' : 'Singular';

    const headerMessage = i18n.t('embeddable_framework.talk.form.headerMessage', {
      fallback: 'Enter your phone number and we\'ll call you as soon as we can.'
    });
    const waitTimeMessage = i18n.t(`embeddable_framework.talk.form.averageWaitTime${waitTimeForm}`, {
      fallback: `Average wait time: ${averageWaitTime}`,
      averageWaitTime
    });

    return (
      <div>
        <p>{headerMessage}</p>
        <p>{waitTimeMessage}</p>
      </div>
    );
  }

  renderFormScreen = () => {
    const phoneLabel = i18n.t(`embeddable_framework.common.textLabel.phone`, { fallback: 'Phone Number' });
    const nameLabel = i18n.t(`embeddable_framework.common.textLabel.name`, { fallback: 'Name' });
    const emailLabel = i18n.t(`embeddable_framework.common.textLabel.email`, { fallback: 'Email' });
    const descriptionLabel = i18n.t(`embeddable_framework.common.textLabel.description`,
      { fallback: 'How can we help?' });
    let { phone, name, email, description } = this.props.formState;

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
          label={phoneLabel}
          required={true}
          value={phone} />
        <Field label={nameLabel}
          required={true}
          value={name}
          name='name' />
        <EmailField
          label={emailLabel}
          required={true}
          value={email} />
        <Field
          label={descriptionLabel}
          required={false}
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

  renderSuccessNotificationScreen = () => {
    const displayNumber = this.props.phoneNumber;
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
    const successNotificationTitle = i18n.t(
      'embeddable_framework.talk.notify.success.title',
      { fallback: 'Request sent' }
    );

    switch (this.props.screen) {
      case SUCCESS_NOTIFICATION_SCREEN:
        return successNotificationTitle;
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
  updateTalkScreen,
  updateTalkCallMeForm,
  updateTalkPhoneNumber
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Talk);
