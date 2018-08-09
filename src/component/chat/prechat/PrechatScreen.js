import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import { ScrollContainer } from 'component/container/ScrollContainer';
import { ChatOfflineMessageForm } from 'component/chat/ChatOfflineMessageForm';
import { PrechatForm } from 'component/chat/prechat/PrechatForm';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
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
  handlePrechatFormSubmit,
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
    handlePrechatFormSubmit: PropTypes.func.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    offlineMessage: PropTypes.object,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    loginSettings: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
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

  getScrollContainerClasses() {
    return classNames(styles.scrollContainer, {
      [styles.mobileContainer]: this.props.isMobile
    });
  }

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
      this.props.handlePrechatFormSubmit(info);
    }

    this.props.resetCurrentMessage();
  }

  renderChatOfflineForm() {
    return (
      <ScrollContainer
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={this.getScrollContainerClasses()}
        containerClasses={styles.scrollContainerContent}
        fullscreen={this.props.isMobile}>
        <ChatOfflineMessageForm
          offlineMessage={this.props.offlineMessage}
          onFormBack={() => this.props.updateChatScreen(screens.PRECHAT_SCREEN)} />
      </ScrollContainer>
    );
  }

  renderPreChatForm() {
    const { form, message } = this.props.prechatFormSettings;

    return (
      <PrechatForm
        getFrameContentDocument={this.props.getFrameContentDocument}
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
        onFormCompleted={this.onPrechatFormComplete}
        isMobile={this.props.isMobile}
        hideZendeskLogo={this.props.hideZendeskLogo} />
    );
  }

  renderLoadingSpinner() {
    return (
      <ScrollContainer
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={this.getScrollContainerClasses()}
        containerClasses={styles.scrollContainerContent}
        fullscreen={this.props.isMobile}>
        <LoadingSpinner className={styles.loadingSpinner} />
      </ScrollContainer>
    );
  }

  render = () => {
    switch (this.props.screen) {
      case screens.PRECHAT_SCREEN: return this.renderPreChatForm();
      case screens.LOADING_SCREEN: return this.renderLoadingSpinner();
      case screens.OFFLINE_MESSAGE_SCREEN: return this.renderChatOfflineForm();
    }
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
  handlePrechatFormSubmit,
  initiateSocialLogout
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(PrechatScreen);
