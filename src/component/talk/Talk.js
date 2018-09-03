import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

import { TalkPhoneField } from 'component/talk/TalkPhoneField';
import { Form } from 'component/form/Form';
import { Icon } from 'component/Icon';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { SuccessNotification } from 'component/shared/SuccessNotification';
import { errorCodes } from './talkErrorCodes';
import { ICONS } from 'src/constants/shared';
import { Button } from '@zendeskgarden/react-buttons';
import classNames from 'classnames';
import { Message, TextField, Label, Input, Textarea } from '@zendeskgarden/react-textfields';

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
  getAverageWaitTime,
  getAverageWaitTimeEnabled,
  getLibPhoneNumberVendor } from 'src/redux/modules/talk/talk-selectors';
import { i18n } from 'service/i18n';
import { renderLabel, getStyledLabelText, shouldRenderErrorMessage } from 'src/util/fields';

import { locals as styles } from './Talk.scss';

const mapStateToProps = (state) => {
  return {
    embeddableConfig: getEmbeddableConfig(state),
    agentAvailability: getAgentAvailability(state),
    formState: getFormState(state),
    screen: getScreen(state),
    callback: getCallback(state),
    averageWaitTime: getAverageWaitTime(state),
    averageWaitTimeEnabled: getAverageWaitTimeEnabled(state),
    libphonenumber: getLibPhoneNumberVendor(state)
  };
};

class Talk extends Component {
  static propTypes = {
    embeddableConfig: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    screen: PropTypes.string.isRequired,
    callback: PropTypes.object.isRequired,
    averageWaitTime: PropTypes.string.isRequired,
    averageWaitTimeEnabled: PropTypes.bool.isRequired,
    agentAvailability: PropTypes.bool.isRequired,
    updateTalkCallbackForm: PropTypes.func.isRequired,
    submitTalkCallbackForm: PropTypes.func.isRequired,
    talkConfig: PropTypes.object.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    helpCenterAvailable: PropTypes.bool,
    channelChoiceAvailable: PropTypes.bool,
    onBackClick: PropTypes.func,
    hideZendeskLogo: PropTypes.bool,
    libphonenumber: PropTypes.object.isRequired
  };

  static defaultProps = {
    hideZendeskLogo: false,
    formState: { phone: '' },
    embeddableConfig: { phoneNumber: '' },
    callback: { error: {} },
    helpCenterAvailable: false,
    channelChoiceAvailable: false,
    onBackClick: () => {},
    agentAvailability: true,
    libphonenumber: {
      parse: () => {},
      format: () => {}
    }
  };

  constructor() {
    super();
    this.form = null;

    this.state = {
      showErrors: false
    };
  }

  handleFormCompleted = (formState) => {
    if (!this.form.state.valid) {
      this.setState({ showErrors: true });
      return;
    }
    this.setState({ showErrors: false });
    const { serviceUrl, nickname } = this.props.talkConfig;

    this.props.submitTalkCallbackForm(formState, serviceUrl, nickname);
  }

  handleFormChange = (formState) => {
    this.props.updateTalkCallbackForm(formState);
  }

  handleCountrySelect = (country) => {
    this.props.updateTalkCallbackForm({ country });
    if (this.form) {
      this.form.validate();
    }
  }

  formatPhoneNumber = (phoneNumber, format = 'International') => {
    const { libphonenumber } = this.props;
    const parsed = libphonenumber.parse(phoneNumber);

    return libphonenumber.format(parsed, format);
  }

  getOfflineScreenLink = () => {
    const { helpCenterAvailable, channelChoiceAvailable } = this.props;

    if (helpCenterAvailable) {
      return i18n.t('embeddable_framework.talk.offline.link.help_center');
    } else if (channelChoiceAvailable) {
      return i18n.t('embeddable_framework.common.button.goBack');
    }

    return '';
  }

  renderPhoneNumber = () => {
    const { phoneNumber } = this.props.embeddableConfig;
    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);

    return (<a className={styles.phoneLink} href={`tel:${phoneNumber}`} target='_blank'>{formattedPhoneNumber}</a>);
  }

  renderAverageWaitTime = () => {
    const { averageWaitTime, averageWaitTimeEnabled } = this.props;

    if (!averageWaitTimeEnabled) return;

    const waitTimeForm = parseInt(averageWaitTime, 10) > 1 ? 'Plural' : 'Singular';
    const waitTimeMessage = i18n.t(`embeddable_framework.talk.form.averageWaitTime${waitTimeForm}`, {
      averageWaitTime
    });

    return <p className={styles.averageWaitTime}>{waitTimeMessage}</p>;
  }

  renderFormHeader = () => {
    const headerMessage = i18n.t('embeddable_framework.talk.form.headerMessage_new');

    return (
      <div>
        <p className={styles.formHeaderMessage}>{headerMessage}</p>
        {this.renderAverageWaitTime()}
      </div>
    );
  }

  renderErrorMessage = (value, required, errorString, pattern) => {
    if (shouldRenderErrorMessage(value, required, this.state.showErrors, pattern)) {
      return <Message validation='error'>{i18n.t(errorString)}</Message>;
    }
    return null;
  }

  renderPhoneField = () => {
    const phoneLabel = i18n.t('embeddable_framework.common.textLabel.phone_number');
    const value = this.props.formState.phone;

    return (
      <TalkPhoneField
        validate={(val) => this.form && this.form.validate(val)}
        rtl={i18n.isRTL()}
        label={getStyledLabelText(phoneLabel, true)}
        required={true}
        onCountrySelect={this.handleCountrySelect}
        libphonenumber={this.props.libphonenumber}
        getFrameContentDocument={this.props.getFrameContentDocument}
        supportedCountries={this.props.embeddableConfig.supportedCountries}
        country={this.props.formState.country}
        value={value}
        showError={this.state.showErrors} />
    );
  }

  renderNameField = () => {
    const nameLabel = i18n.t('embeddable_framework.common.textLabel.name');
    const isRequired = false;
    const value = this.props.formState.name;
    const error = this.renderErrorMessage(value, isRequired, 'embeddable_framework.validation.error.name');

    return (
      <TextField className={styles.textField}>
        {renderLabel(Label, nameLabel, isRequired)}
        <Input
          value={value}
          name='name'
          validation={error ? 'error' : 'none'}
          required={isRequired} />
        {error}
      </TextField>
    );
  }

  renderDescriptionField = () => {
    const descriptionLabel = i18n.t('embeddable_framework.common.textLabel.description');
    const isRequired = false;
    const value = this.props.formState.description;
    const error = this.renderErrorMessage(value, isRequired, 'embeddable_framework.validation.error.message');

    return (
      <TextField className={styles.textField}>
        {renderLabel(Label, descriptionLabel, isRequired)}
        <Textarea
          value={this.props.formState.value}
          rows='4'
          name='description'
          required={isRequired}
          validation={error ? 'error' : 'none'} />
        {error}
      </TextField>
    );
  }

  renderFormScreen = () => {
    const submitButtonStyles = classNames(styles.submitButton, { [styles.submitBtnMobile]: this.props.isMobile });

    return (
      <Form
        ref={(el) => this.form = el}
        className={styles.form}
        submitButtonClasses={submitButtonStyles}
        submitButtonLabel={i18n.t('embeddable_framework.common.button.send')}
        rtl={i18n.isRTL()}
        isMobile={this.props.isMobile}
        formState={this.props.formState}
        onCompleted={this.handleFormCompleted}
        onChange={this.handleFormChange}>
        {this.renderFormHeader()}
        <div className={styles.formDivider} />
        {this.renderPhoneField()}
        {this.renderNameField()}
        {this.renderDescriptionField()}
        {this.renderErrorNotification()}
      </Form>
    );
  }

  renderPhoneFormScreen = () => {
    const phoneLabel = i18n.t('embeddable_framework.talk.form.phoneDisplay');

    return (
      <div>
        <div className={styles.phoneDisplayLabel}>
          {phoneLabel} {this.renderPhoneNumber()}
        </div>
        {this.renderFormScreen()}
      </div>
    );
  }

  renderPhoneOnlyScreen = () => {
    const containerClasses = classNames(
      styles.phoneOnlyContainer,
      { [styles.phoneOnlyMobileContainer]: this.props.isMobile }
    );

    let callUsMessage = i18n.t('embeddable_framework.talk.phoneOnly.new_message');

    const talkIcon = (
      <Icon
        type={ICONS.TALK}
        className='u-userFillCustomColor'
        isMobile={this.props.isMobile}
      />
    );

    return (
      <div className={containerClasses}>
        {talkIcon}
        <p className={styles.phoneOnlyMessage}>
          {callUsMessage}
        </p>
        {this.renderAverageWaitTime()}
        <div className={styles.phoneNumber}>{this.renderPhoneNumber()}</div>
      </div>
    );
  }

  renderSuccessNotificationScreen = () => {
    return (
      <SuccessNotification
        icon={ICONS.SUCCESS_TALK}
        isMobile={this.props.isMobile}
      />
    );
  }

  renderContent = () => {
    if (!this.props.agentAvailability) return null;

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
    switch (this.props.screen) {
      case SUCCESS_NOTIFICATION_SCREEN:
        return i18n.t('embeddable_framework.talk.notify.success.title');
      case PHONE_ONLY_SCREEN:
        return i18n.t('embeddable_framework.talk.phoneOnly.title');
      case CALLBACK_ONLY_SCREEN:
      case CALLBACK_AND_PHONE_SCREEN:
      default:
        return i18n.t('embeddable_framework.talk.form.title');
    }
  }

  renderOfflineScreen = () => {
    if (this.props.agentAvailability) return null;

    return (
      <div className={styles.offline}>
        <p className={styles.offlineLabel}>
          {i18n.t('embeddable_framework.talk.offline.label')}
        </p>
        <p className={styles.offlineLink} onClick={this.props.onBackClick}>
          <a>{this.getOfflineScreenLink()}</a>
        </p>
      </div>
    );
  }

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo || this.props.isMobile) return;

    return <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />;
  }

  renderFooterContent = () => {
    if (this.props.screen !== SUCCESS_NOTIFICATION_SCREEN) {
      return null;
    }

    const buttonContainer = classNames({
      [styles.zendeskLogoButton]: !(this.props.hideZendeskLogo || this.props.isMobile),
      [styles.noZendeskLogoButton]: this.props.hideZendeskLogo || this.props.isMobile
    });

    return (
      <div className={buttonContainer}>
        <Button
          primary={true}
          className={styles.button}
          onClick={this.props.onBackClick}>
          {i18n.t('embeddable_framework.common.button.done')}
        </Button>
      </div>
    );
  }

  resolveErrorMessage(code) {
    return _.includes(errorCodes, code)
      ? i18n.t(`embeddable_framework.talk.notify.error.${code}`)
      : i18n.t('embeddable_framework.common.notify.error.generic');
  }

  renderErrorNotification = () => {
    const { error } = this.props.callback;

    if (_.isEmpty(error)) return null;

    const errorMsg = this.resolveErrorMessage(error.message);

    return (
      <div className={styles.error}>
        <Icon type='Icon--error' className={styles.errorIcon} />
        {errorMsg}
      </div>
    );
  }

  render = () => {
    const { isMobile, screen } = this.props;
    const contentClasses = (isMobile) ? styles.contentMobile : styles.content;
    const scrollContainerClasses = classNames({
      [styles.scrollContainerSuccess]: screen === SUCCESS_NOTIFICATION_SCREEN
    });

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          containerClasses={scrollContainerClasses}
          footerContent={this.renderFooterContent()}
          title={this.renderFormTitle()}>
          <div className={contentClasses}>
            {this.renderContent()}
            {this.renderOfflineScreen()}
          </div>
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    );
  }
}

const actionCreators = {
  updateTalkCallbackForm,
  submitTalkCallbackForm
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Talk);
