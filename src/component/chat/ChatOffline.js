import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ChatOfflineForm } from 'component/chat/ChatOfflineForm'
import {
  chatOfflineFormChanged,
  sendOfflineMessage,
  handleOfflineFormBack,
  handleOperatingHoursClick,
  initiateSocialLogout,
  openedChatHistory
} from 'src/redux/modules/chat'
import {
  getChatOfflineForm,
  getOfflineMessage,
  getLoginSettings,
  getGroupedOperatingHours,
  getSocialLogin,
  getAuthUrls,
  getChatVisitor,
  getIsAuthenticated,
  getReadOnlyState
} from 'src/redux/modules/chat/chat-selectors'
import { getChatHistoryLabel } from 'src/redux/modules/selectors'
import {
  getChatTitle,
  getOfflineFormSettings,
  getOfflineFormFields
} from 'src/redux/modules/selectors'
import { getWidgetShown } from 'src/redux/modules/base/base-selectors'
import { getHasChatHistory } from 'src/redux/modules/chat/chat-history-selectors'
import NoAgentsPage from 'src/embeds/chat/pages/NoAgentsPage'

const mapStateToProps = state => {
  return {
    readOnlyState: getReadOnlyState(state),
    formState: getChatOfflineForm(state),
    formFields: getOfflineFormFields(state),
    formSettings: getOfflineFormSettings(state),
    loginSettings: getLoginSettings(state),
    offlineMessage: getOfflineMessage(state),
    hasChatHistory: getHasChatHistory(state),
    operatingHours: getGroupedOperatingHours(state),
    socialLogin: getSocialLogin(state),
    authUrls: getAuthUrls(state),
    visitor: getChatVisitor(state),
    isAuthenticated: getIsAuthenticated(state),
    widgetShown: getWidgetShown(state),
    title: getChatTitle(state),
    chatHistoryLabel: getChatHistoryLabel(state)
  }
}

class ChatOffline extends Component {
  static propTypes = {
    chatOfflineFormChanged: PropTypes.func.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    sendOfflineMessage: PropTypes.func.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired,
    handleOperatingHoursClick: PropTypes.func.isRequired,
    readOnlyState: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    formFields: PropTypes.object.isRequired,
    formSettings: PropTypes.object.isRequired,
    loginSettings: PropTypes.object.isRequired,
    offlineMessage: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    authUrls: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    operatingHours: PropTypes.object,
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    chatId: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired,
    widgetShown: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    hasChatHistory: PropTypes.bool.isRequired,
    openedChatHistory: PropTypes.func.isRequired,
    chatHistoryLabel: PropTypes.string.isRequired
  }

  static defaultProps = {
    sendOfflineMessage: () => {},
    operatingHours: {},
    isMobile: false,
    hideZendeskLogo: false,
    chatId: '',
    formSettings: { enabled: false },
    offlineMessage: {},
    loginSettings: {}
  }

  renderOfflineForm = () => {
    return (
      <ChatOfflineForm
        title={this.props.title}
        widgetShown={this.props.widgetShown}
        initiateSocialLogout={this.props.initiateSocialLogout}
        visitor={this.props.visitor}
        socialLogin={this.props.socialLogin}
        authUrls={this.props.authUrls}
        formFields={this.props.formFields}
        readOnlyState={this.props.readOnlyState}
        formState={this.props.formState}
        channels={this.props.formSettings.channels}
        phoneEnabled={this.props.loginSettings.phoneEnabled}
        greeting={this.props.formSettings.message}
        offlineMessage={this.props.offlineMessage}
        handleOfflineFormBack={this.props.handleOfflineFormBack}
        handleOperatingHoursClick={this.props.handleOperatingHoursClick}
        sendOfflineMessage={this.props.sendOfflineMessage}
        chatOfflineFormChanged={this.props.chatOfflineFormChanged}
        operatingHours={this.props.operatingHours}
        isAuthenticated={this.props.isAuthenticated}
        isMobile={this.props.isMobile}
        chatId={this.props.chatId}
        fullscreen={this.props.fullscreen}
        hideZendeskLogo={this.props.hideZendeskLogo}
        hasChatHistory={this.props.hasChatHistory}
        openedChatHistory={this.props.openedChatHistory}
        chatHistoryLabel={this.props.chatHistoryLabel}
      />
    )
  }

  render() {
    return this.props.formSettings.enabled ? this.renderOfflineForm() : <NoAgentsPage />
  }
}

const actionCreators = {
  chatOfflineFormChanged,
  sendOfflineMessage,
  handleOfflineFormBack,
  handleOperatingHoursClick,
  getGroupedOperatingHours,
  initiateSocialLogout,
  openedChatHistory
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(ChatOffline)

export { connectedComponent as default, ChatOffline as Component }
