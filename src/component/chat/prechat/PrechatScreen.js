import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import { ScrollContainer } from 'component/container/ScrollContainer';
import { PrechatForm } from 'component/chat/prechat/PrechatForm';
import { ChatOfflineMessageForm } from 'component/chat/ChatOfflineMessageForm';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { DEPARTMENT_STATUSES } from 'constants/chat';
import * as screens from 'src/redux/modules/chat/chat-screen-types';
import {
  sendMsg,
  setDepartment,
  updateChatScreen,
  handlePreChatFormChange,
  resetCurrentMessage,
  sendOfflineMessage,
  setVisitorInfo,
  clearDepartment,
  initiateSocialLogout } from 'src/redux/modules/chat';
import {
  getDepartments,
  getPrechatFormFields,
  getPrechatFormSettings,
  getChatScreen,
  getPreChatFormState,
  getLoginSettings,
  getOfflineMessage,
  getAuthUrls,
  getSocialLogin,
  getChatVisitor,
  getIsAuthenticated } from 'src/redux/modules/chat/chat-selectors';
import { locals as styles } from './PrechatScreen.scss';

const mapStateToProps = (state) => {
  const prechatForm = getPrechatFormSettings(state);
  const prechatFormFields = getPrechatFormFields(state);

  return {
    departments: getDepartments(state),
    prechatFormSettings: { ...prechatForm, form: prechatFormFields },
    screen: getChatScreen(state),
    loginSettings: getLoginSettings(state),
    offlineMessage: getOfflineMessage(state),
    authUrls: getAuthUrls(state),
    visitor: getChatVisitor(state),
    socialLogin: getSocialLogin(state),
    chatVisitor: getChatVisitor(state),
    preChatFormState: getPreChatFormState(state),
    isAuthenticated: getIsAuthenticated(state)
  };
};

class PrechatScreen extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    updateChatScreen: PropTypes.func.isRequired,
    setDepartment: PropTypes.func.isRequired,
    departments: PropTypes.object,
    sendOfflineMessage: PropTypes.func,
    sendMsg: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    visitor: PropTypes.object.isRequired,
    preChatFormState: PropTypes.object,
    handlePreChatFormChange: PropTypes.func,
    clearDepartment: PropTypes.func,
    setVisitorInfo: PropTypes.func.isRequired,
    resetCurrentMessage: PropTypes.func,
    prechatFormSettings: PropTypes.object.isRequired,
    offlineMessage: PropTypes.object,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    loginSettings: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    newHeight: PropTypes.bool.isRequired
  };

  static defaultProps = {
    isMobile: false,
    hideZendeskLogo: false,
    departments: {},
    sendOfflineMessage: () => {},
    clearDepartment: () => {},
    resetCurrentMessage: () => {},
    preChatFormSettings: {},
    loginSettings: {}
  };

  onPrechatFormComplete = (info) => {
    const selectedDepartment = parseInt(info.department);
    const isSelectedDepartmentOffline = (!!selectedDepartment &&
      this.props.departments[selectedDepartment].status !== DEPARTMENT_STATUSES.ONLINE);

    if (isSelectedDepartmentOffline) {
      const successCallback = () => this.props.updateChatScreen(screens.OFFLINE_MESSAGE_SCREEN);
      const failureCallback = () => this.props.updateChatScreen(screens.PRECHAT_SCREEN);

      this.props.updateChatScreen(screens.LOADING_SCREEN);
      this.props.sendOfflineMessage(info, successCallback, failureCallback);
    } else {
      const sendOnlineMessage = () => info.message ? this.props.sendMsg(info.message) : null;

      if (selectedDepartment) {
        this.props.setDepartment(
          selectedDepartment,
          sendOnlineMessage,
          sendOnlineMessage
        );
      } else {
        this.props.clearDepartment(sendOnlineMessage);
      }
      this.props.setVisitorInfo(
        _.omitBy({
          display_name: info.display_name || info.name,
          email: info.email,
          phone: info.phone
        }, _.isNil)
      );
      this.props.updateChatScreen(screens.CHATTING_SCREEN);
    }

    this.props.resetCurrentMessage();
  }

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={`${styles.zendeskLogo}`}
        rtl={i18n.isRTL()}
        fullscreen={false}
      /> : null;
  }

  render = () => {
    const { form, message } = this.props.prechatFormSettings;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: this.props.isMobile }
    );
    const logoFooterClasses = classNames({
      [styles.logoFooter]: !this.props.hideZendeskLogo
    });
    let formScreen = null;

    if (this.props.screen === screens.PRECHAT_SCREEN) {
      formScreen = (
        <PrechatForm
          authUrls={this.props.authUrls}
          socialLogin={this.props.socialLogin}
          chatVisitor={this.props.visitor}
          initiateSocialLogout={this.props.initiateSocialLogout}
          form={form}
          formState={this.props.preChatFormState}
          onPrechatFormChange={this.props.handlePreChatFormChange}
          loginEnabled={this.props.loginSettings.enabled}
          greetingMessage={message}
          isAuthenticated={this.props.isAuthenticated}
          visitor={this.props.visitor}
          onFormCompleted={this.onPrechatFormComplete} />
      );
    } else if (this.props.screen === screens.OFFLINE_MESSAGE_SCREEN) {
      formScreen = (
        <ChatOfflineMessageForm
          offlineMessage={this.props.offlineMessage}
          onFormBack={() => this.props.updateChatScreen(screens.PRECHAT_SCREEN)} />
      );
    } else if (this.props.screen === screens.LOADING_SCREEN) {
      formScreen = <LoadingSpinner className={styles.loadingSpinner} />;
    }

    return (
      <ScrollContainer
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        footerClasses={logoFooterClasses}
        footerContent={this.renderZendeskLogo()}
        fullscreen={this.props.isMobile}
        newHeight={this.props.newHeight}>
        {formScreen}
      </ScrollContainer>
    );
  }
}

const actionCreators = {
  updateChatScreen,
  setDepartment,
  setVisitorInfo,
  sendOfflineMessage,
  sendMsg,
  clearDepartment,
  resetCurrentMessage,
  handlePreChatFormChange,
  initiateSocialLogout
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(PrechatScreen);
