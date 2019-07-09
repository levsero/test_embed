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
import { Message } from '@zendeskgarden/react-textfields';
import ErrorNotification from './ErrorNotification';
import PhoneNumber from './PhoneNumber';
import DescriptionField from './DescriptionField';
import NameField from './NameField';
import AverageWaitTime from './AverageWaitTime';

import {
  CALLBACK_ONLY_SCREEN,
  PHONE_ONLY_SCREEN,
  CALLBACK_AND_PHONE_SCREEN,
  SUCCESS_NOTIFICATION_SCREEN
} from 'src/redux/modules/talk/talk-screen-types';
import {
  updateTalkCallbackForm,
  submitTalkCallbackForm
} from 'src/redux/modules/talk';
import {
  getEmbeddableConfig,
  getAgentAvailability,
  getFormState,
  getScreen,
  getCallback,
  getAverageWaitTimeString,
  getLibPhoneNumberVendor,
  getFormattedPhoneNumber,
} from 'src/redux/modules/talk/talk-selectors';
import {
  getTalkTitle,
  getTalkNickname,
  getTalkServiceUrl,
  getTalkDescriptionLabel,
  getTalkNameLabel,
} from 'src/redux/modules/selectors';
import { i18n } from 'service/i18n';
import { getStyledLabelText, shouldRenderErrorMessage } from 'src/util/fields';
import OfflinePage from 'src/embeds/talk/pages/offline';

import { locals as styles } from './Talk.scss';

const mapStateToProps = (state) => {
  return {
    embeddableConfig: getEmbeddableConfig(state),
    agentAvailability: getAgentAvailability(state),
    formState: getFormState(state),
    screen: getScreen(state),
    callback: getCallback(state),
    formattedPhoneNumber: getFormattedPhoneNumber(state),
    averageWaitTime: getAverageWaitTimeString(state),
    libphonenumber: getLibPhoneNumberVendor(state),
    title: getTalkTitle(state),
    nickname: getTalkNickname(state),
    serviceUrl: getTalkServiceUrl(state),
    namelabelText: getTalkNameLabel(state),
    descriptionlabelText: getTalkDescriptionLabel(state),
  };
};

class Talk extends Component {
  static propTypes = {
    embeddableConfig: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    screen: PropTypes.string.isRequired,
    callback: PropTypes.object.isRequired,
    averageWaitTime: PropTypes.string,
    agentAvailability: PropTypes.bool.isRequired,
    updateTalkCallbackForm: PropTypes.func.isRequired,
    submitTalkCallbackForm: PropTypes.func.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    onBackClick: PropTypes.func,
    hideZendeskLogo: PropTypes.bool,
    formattedPhoneNumber: PropTypes.string.isRequired,
    libphonenumber: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    serviceUrl: PropTypes.string.isRequired,
    descriptionlabelText: PropTypes.string.isRequired,
    namelabelText: PropTypes.string.isRequired,
  };

  static defaultProps = {
    hideZendeskLogo: false,
    formState: { phone: '' },
    callback: { error: {} },
    onBackClick: () => {},
    agentAvailability: true,
  };

  constructor() {
    super();
    this.form = null;

    this.state = {
      showErrors: false
    };
  }

  handleFormCompleted = () => {
    if (!this.form.state.valid) {
      this.setState({ showErrors: true });
      return;
    }

    const { serviceUrl, nickname, submitTalkCallbackForm } = this.props;

    this.setState({ showErrors: false });
    submitTalkCallbackForm(serviceUrl, nickname);
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

  renderPhoneNumber = () => {
    const { phoneNumber } = this.props.embeddableConfig;
    const { formattedPhoneNumber } = this.props;

    return (<PhoneNumber phoneNumber={phoneNumber} formattedPhoneNumber={formattedPhoneNumber} />);
  }

  renderFormHeader = () => {
    const headerMessage = i18n.t('embeddable_framework.talk.form.headerMessage_new');

    return (
      <div>
        <p className={styles.formHeaderMessage}>{headerMessage}</p>
        {this.props.averageWaitTime && <AverageWaitTime message={this.props.averageWaitTime} />}
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
        showError={this.state.showErrors}
      />
    );
  }

  renderNameField = () => {
    return (
      <NameField
        label={this.props.namelabelText}
        defaultValue={this.props.formState.name}
      />
    );
  }

  renderDescriptionField = () => {
    return (
      <DescriptionField
        label={this.props.descriptionlabelText}
        defaultValue={this.props.formState.description}
      />
    );
  }

  renderFormScreen = () => {
    const submitButtonStyles = classNames(styles.submitButton, { [styles.submitBtnMobile]: this.props.isMobile });
    const { isMobile, formState, callback } = this.props;

    return (
      <Form
        ref={(el) => this.form = el}
        className={styles.form}
        submitButtonClasses={submitButtonStyles}
        submitButtonLabel={i18n.t('embeddable_framework.common.button.send')}
        rtl={i18n.isRTL()}
        isMobile={isMobile}
        formState={formState}
        onCompleted={this.handleFormCompleted}
        onChange={this.handleFormChange}>
        {this.renderFormHeader()}
        <div className={styles.formDivider} />
        {this.renderPhoneField()}
        {this.renderNameField()}
        {this.renderDescriptionField()}
        {callback.error.message &&
          <ErrorNotification message={this.resolveErrorMessage(callback.error.message)} />}
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
        {this.props.averageWaitTime && <AverageWaitTime message={this.props.averageWaitTime} />}
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

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo || this.props.isMobile) return;

    return <ZendeskLogo fullscreen={false} />;
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

  render = () => {
    const { isMobile, screen } = this.props;
    const contentClasses = (isMobile) ? styles.contentMobile : styles.content;
    const scrollContainerClasses = classNames({
      [styles.scrollContainerSuccess]: screen === SUCCESS_NOTIFICATION_SCREEN,
      [styles.scrollContainerFullHeight]: !this.props.agentAvailability
    });

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          containerClasses={scrollContainerClasses}
          footerContent={this.renderFooterContent()}
          isMobile={this.props.isMobile}
          title={this.props.title}>
          <div className={contentClasses}>
            {
              this.props.agentAvailability
                ? this.renderContent()
                : <OfflinePage />
            }
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

export { Talk as Component };
export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Talk);
