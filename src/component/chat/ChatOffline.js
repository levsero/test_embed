import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { i18n } from 'service/i18n';
import classNames from 'classnames';

import { OFFLINE_FORM_SCREENS } from 'constants/chat';
import { Button } from 'component/button/Button';
import { ChatOfflineForm } from 'component/chat/ChatOfflineForm';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { chatOfflineFormChanged,
  sendOfflineMessage,
  handleOfflineFormBack,
  handleOperatingHoursClick,
  initiateSocialLogout } from 'src/redux/modules/chat';
import { getChatOfflineForm,
  getOfflineMessage,
  getOfflineFormSettings,
  getOfflineFormFields,
  getGroupedOperatingHours,
  getSocialLogin,
  getAuthUrls,
  getChatVisitor,
  getIsAuthenticated } from 'src/redux/modules/chat/chat-selectors';

import { locals as styles } from './ChatOffline.scss';

const mapStateToProps = (state) => {
  return {
    formState: getChatOfflineForm(state),
    formFields: getOfflineFormFields(state),
    formSettings: getOfflineFormSettings(state),
    offlineMessage: getOfflineMessage(state),
    operatingHours: getGroupedOperatingHours(state),
    socialLogin: getSocialLogin(state),
    authUrls: getAuthUrls(state),
    visitor: getChatVisitor(state),
    isAuthenticated: getIsAuthenticated(state)
  };
};

class ChatOffline extends Component {
  static propTypes = {
    updateFrameSize: PropTypes.func.isRequired,
    chatOfflineFormChanged: PropTypes.func.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    sendOfflineMessage: PropTypes.func.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired,
    handleOperatingHoursClick: PropTypes.func.isRequired,
    formState: PropTypes.object.isRequired,
    formFields: PropTypes.object.isRequired,
    formSettings: PropTypes.object.isRequired,
    offlineMessage: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    authUrls: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    handleCloseClick: PropTypes.func,
    operatingHours: PropTypes.object,
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    isAuthenticated: PropTypes.bool.isRequired,
    newHeight: PropTypes.bool.isRequired
  };

  static defaultProps = {
    updateFrameSize: () => {},
    handleCloseClick: () => {},
    sendOfflineMessage: () => {},
    operatingHours: {},
    isMobile: false,
    hideZendeskLogo: false,
    formSettings: { enabled: false },
    offlineMessage: {}
  };

  renderOfflineForm = () => {
    return (
      <ChatOfflineForm
        initiateSocialLogout={this.props.initiateSocialLogout}
        visitor={this.props.visitor}
        socialLogin={this.props.socialLogin}
        authUrls={this.props.authUrls}
        formFields={this.props.formFields}
        formState={this.props.formState}
        offlineMessage={this.props.offlineMessage}
        handleOfflineFormBack={this.props.handleOfflineFormBack}
        handleOperatingHoursClick={this.props.handleOperatingHoursClick}
        sendOfflineMessage={this.props.sendOfflineMessage}
        chatOfflineFormChanged={this.props.chatOfflineFormChanged}
        operatingHours={this.props.operatingHours}
        updateFrameSize={this.props.updateFrameSize}
        isAuthenticated={this.props.isAuthenticated}
        isMobile={this.props.isMobile}
        newHeight={this.props.newHeight}
        hideZendeskLogo={this.props.hideZendeskLogo} />
    );
  }

  renderChatOfflineScreen = () => {
    const scrollContainerClasses = classNames(styles.scrollContainer, {
      [styles.mobileContainer]: this.props.isMobile,
      [styles.scrollContainer]: !this.props.newHeight
    });

    return (
      <ScrollContainer
        ref='scrollContainer'
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        title={i18n.t('embeddable_framework.chat.title')}
        newHeight={this.props.newHeight}>
        <div>
          <p className={styles.greeting}>
            {i18n.t('embeddable_framework.chat.offline.label.noForm')}
          </p>
          <Button
            onTouchStartDisabled={true}
            label={i18n.t('embeddable_framework.chat.offline.button.close')}
            onClick={this.props.handleCloseClick}
            className={styles.button} />
        </div>
      </ScrollContainer>
    );
  }

  renderFooterContent = () => {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.SUCCESS || !this.props.newHeight) return;

    return (
      <Button
        onTouchStartDisabled={true}
        label={i18n.t('embeddable_framework.common.button.done')}
        className={styles.button}
        primary={false}
        onClick={this.props.handleOfflineFormBack}
        type='button'
        fullscreen={this.props.isMobile}
      />
    );
  }

  render() {
    return (this.props.formSettings.enabled)
      ? this.renderOfflineForm()
      : this.renderChatOfflineScreen();
  }
}

const actionCreators = {
  chatOfflineFormChanged,
  sendOfflineMessage,
  handleOfflineFormBack,
  handleOperatingHoursClick,
  getGroupedOperatingHours,
  initiateSocialLogout
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(ChatOffline);
