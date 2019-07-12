import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { ScrollContainer } from 'component/container/ScrollContainer'
import { ChatOfflineMessageForm } from 'component/chat/ChatOfflineMessageForm'
import { PrechatForm } from 'component/chat/prechat/PrechatForm'
import { LoadingSpinner } from 'component/loading/LoadingSpinner'
import { DEPARTMENT_STATUSES } from 'constants/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
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
  initiateSocialLogout,
  openedChatHistory
} from 'src/redux/modules/chat'
import {
  getDepartments,
  getChatScreen,
  getPreChatFormState,
  getLoginSettings,
  getOfflineMessage,
  getAuthUrls,
  getSocialLogin,
  getChatVisitor,
  getIsAuthenticated,
  getReadOnlyState
} from 'src/redux/modules/chat/chat-selectors'
import {
  getChatTitle,
  getPrechatFormSettings,
  getPrechatFormFields,
  getChatHistoryLabel
} from 'src/redux/modules/selectors'
import {
  getSettingsChatDepartmentsEmpty,
  getSettingsChatDepartmentsEnabled
} from 'src/redux/modules/settings/settings-selectors'
import { locals as styles } from './PrechatScreen.scss'
import { getHasChatHistory } from 'src/redux/modules/chat/chat-history-selectors'

const mapStateToProps = state => {
  const prechatForm = getPrechatFormSettings(state)
  const prechatFormFields = getPrechatFormFields(state)

  return {
    departments: getDepartments(state),
    prechatFormSettings: { ...prechatForm, form: prechatFormFields },
    settingsDepartmentsEnabled: getSettingsChatDepartmentsEnabled(state),
    screen: getChatScreen(state),
    loginSettings: getLoginSettings(state),
    offlineMessage: getOfflineMessage(state),
    authUrls: getAuthUrls(state),
    visitor: getChatVisitor(state),
    socialLogin: getSocialLogin(state),
    chatVisitor: getChatVisitor(state),
    readOnlyState: getReadOnlyState(state),
    preChatFormState: getPreChatFormState(state),
    isAuthenticated: getIsAuthenticated(state),
    title: getChatTitle(state),
    departmentFieldHidden: getSettingsChatDepartmentsEmpty(state),
    hasChatHistory: getHasChatHistory(state),
    chatHistoryLabel: getChatHistoryLabel(state)
  }
}

class PrechatScreen extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    chatId: PropTypes.string,
    updateChatScreen: PropTypes.func.isRequired,
    setDepartment: PropTypes.func.isRequired,
    departments: PropTypes.object,
    hasChatHistory: PropTypes.bool.isRequired,
    sendOfflineMessage: PropTypes.func,
    sendMsg: PropTypes.func.isRequired,
    screen: PropTypes.string.isRequired,
    visitor: PropTypes.object.isRequired,
    readOnlyState: PropTypes.object.isRequired,
    preChatFormState: PropTypes.object,
    handlePreChatFormChange: PropTypes.func,
    clearDepartment: PropTypes.func,
    setVisitorInfo: PropTypes.func.isRequired,
    resetCurrentMessage: PropTypes.func,
    prechatFormSettings: PropTypes.object.isRequired,
    settingsDepartmentsEnabled: PropTypes.array,
    handlePrechatFormSubmit: PropTypes.func.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    offlineMessage: PropTypes.object,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    loginSettings: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool,
    departmentFieldHidden: PropTypes.bool.isRequired,
    openedChatHistory: PropTypes.func.isRequired,
    chatHistoryLabel: PropTypes.string.isRequired
  }

  static defaultProps = {
    isMobile: false,
    fullscreen: false,
    hideZendeskLogo: false,
    chatId: '',
    departments: {},
    sendOfflineMessage: () => {},
    clearDepartment: () => {},
    resetCurrentMessage: () => {},
    preChatFormSettings: {},
    loginSettings: {},
    departmentFieldHidden: false,
    settingsDepartmentsEnabled: []
  }

  onPrechatFormComplete = info => {
    const currentDepartment = parseInt(info.department)
    const isSelectedDepartmentUnavailable =
      !!currentDepartment && !this.props.departments[currentDepartment]
    const selectedDepartment = isSelectedDepartmentUnavailable ? undefined : currentDepartment

    const isSelectedDepartmentOffline =
      !!selectedDepartment &&
      !isSelectedDepartmentUnavailable &&
      this.props.departments[selectedDepartment].status === DEPARTMENT_STATUSES.OFFLINE

    if (isSelectedDepartmentOffline) {
      const successCallback = () => this.props.updateChatScreen(screens.OFFLINE_MESSAGE_SCREEN)
      const failureCallback = () => this.props.updateChatScreen(screens.PRECHAT_SCREEN)

      this.props.updateChatScreen(screens.LOADING_SCREEN)
      this.props.sendOfflineMessage(info, successCallback, failureCallback)
    } else {
      const sendOnlineMessage = () => (info.message ? this.props.sendMsg(info.message) : null)

      if (this.props.departmentFieldHidden) {
        if (sendOnlineMessage) sendOnlineMessage()
      } else if (selectedDepartment) {
        this.props.setDepartment(selectedDepartment, sendOnlineMessage, sendOnlineMessage)
      } else {
        this.props.clearDepartment(sendOnlineMessage)
      }
      if (info.display_name || info.name || info.email || info.phone) {
        this.props.setVisitorInfo(
          _.omitBy(
            {
              display_name: info.display_name || info.name,
              email: info.email,
              phone: info.phone
            },
            _.isNil
          )
        )
      }
      this.props.handlePrechatFormSubmit(info)
    }

    this.props.resetCurrentMessage()
  }

  renderChatOfflineForm() {
    return (
      <ScrollContainer
        title={this.props.title}
        containerClasses={styles.scrollContainerContent}
        fullscreen={this.props.fullscreen}
        isMobile={this.props.isMobile}
      >
        <ChatOfflineMessageForm
          offlineMessage={this.props.offlineMessage}
          onFormBack={() => this.props.updateChatScreen(screens.PRECHAT_SCREEN)}
        />
      </ScrollContainer>
    )
  }

  renderPreChatForm() {
    const { form, message, settingsDepartmentsEnabled } = this.props.prechatFormSettings

    return (
      <PrechatForm
        title={this.props.title}
        getFrameContentDocument={this.props.getFrameContentDocument}
        authUrls={this.props.authUrls}
        socialLogin={this.props.socialLogin}
        chatVisitor={this.props.visitor}
        initiateSocialLogout={this.props.initiateSocialLogout}
        hasChatHistory={this.props.hasChatHistory}
        form={form}
        settingsDepartmentsEnabled={settingsDepartmentsEnabled}
        readOnlyState={this.props.readOnlyState}
        formState={this.props.preChatFormState}
        onPrechatFormChange={this.props.handlePreChatFormChange}
        loginEnabled={this.props.loginSettings.enabled}
        phoneEnabled={this.props.loginSettings.phoneEnabled}
        greetingMessage={message}
        isAuthenticated={this.props.isAuthenticated}
        visitor={this.props.visitor}
        onFormCompleted={this.onPrechatFormComplete}
        isMobile={this.props.isMobile}
        chatId={this.props.chatId}
        fullscreen={this.props.fullscreen}
        hideZendeskLogo={this.props.hideZendeskLogo}
        openedChatHistory={this.props.openedChatHistory}
        chatHistoryLabel={this.props.chatHistoryLabel}
      />
    )
  }

  renderLoadingSpinner() {
    return (
      <ScrollContainer
        title={this.props.title}
        containerClasses={styles.scrollContainerContent}
        fullscreen={this.props.fullscreen}
        isMobile={this.props.isMobile}
      >
        <LoadingSpinner className={styles.loadingSpinner} />
      </ScrollContainer>
    )
  }

  render = () => {
    switch (this.props.screen) {
      case screens.PRECHAT_SCREEN:
        return this.renderPreChatForm()
      case screens.LOADING_SCREEN:
        return this.renderLoadingSpinner()
      case screens.OFFLINE_MESSAGE_SCREEN:
        return this.renderChatOfflineForm()
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
  initiateSocialLogout,
  openedChatHistory
}

export default connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(PrechatScreen)
