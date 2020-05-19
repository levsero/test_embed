import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { connect } from 'react-redux'

import { ChatOfflineForm } from 'component/chat/ChatOfflineForm'
import {
  chatOfflineFormChanged,
  sendOfflineMessage,
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
import { getChatHistoryLabel, getHideZendeskLogo } from 'src/redux/modules/selectors'
import {
  getChatTitle,
  getOfflineFormSettings,
  getOfflineFormFields
} from 'src/redux/modules/selectors'
import { cancelButtonClicked } from 'src/redux/modules/base'
import { getWidgetShown } from 'src/redux/modules/base/base-selectors'
import { getHasChatHistory } from 'src/redux/modules/chat/chat-history-selectors'
import NoAgentsPage from 'src/embeds/chat/pages/NoAgentsPage'

const ChatOffline = ({
  authUrls,
  chatHistoryLabel,
  chatOfflineFormChanged,
  formFields,
  formSettings = { enabled: false },
  formState,
  handleOperatingHoursClick,
  hasChatHistory,
  hideZendeskLogo = false,
  initiateSocialLogout,
  isAuthenticated,
  loginSettings = {},
  offlineMessage = {},
  openedChatHistory,
  operatingHours = {},
  readOnlyState,
  sendOfflineMessage = () => {},
  socialLogin,
  theme: { isMobile },
  title,
  visitor,
  widgetShown
}) => {
  const renderOfflineForm = () => {
    return (
      <ChatOfflineForm
        title={title}
        widgetShown={widgetShown}
        initiateSocialLogout={initiateSocialLogout}
        visitor={visitor}
        socialLogin={socialLogin}
        authUrls={authUrls}
        formFields={formFields}
        readOnlyState={readOnlyState}
        formState={formState}
        channels={formSettings.channels}
        phoneEnabled={loginSettings.phoneEnabled}
        greeting={formSettings.message}
        offlineMessage={offlineMessage}
        handleOperatingHoursClick={handleOperatingHoursClick}
        sendOfflineMessage={sendOfflineMessage}
        chatOfflineFormChanged={chatOfflineFormChanged}
        operatingHours={operatingHours}
        isAuthenticated={isAuthenticated}
        isMobile={isMobile}
        hideZendeskLogo={hideZendeskLogo}
        hasChatHistory={hasChatHistory}
        openedChatHistory={openedChatHistory}
        chatHistoryLabel={chatHistoryLabel}
      />
    )
  }

  return formSettings.enabled ? renderOfflineForm() : <NoAgentsPage />
}

ChatOffline.propTypes = {
  authUrls: PropTypes.object.isRequired,
  chatHistoryLabel: PropTypes.string.isRequired,
  chatOfflineFormChanged: PropTypes.func.isRequired,
  formFields: PropTypes.object.isRequired,
  formSettings: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  handleOperatingHoursClick: PropTypes.func.isRequired,
  hasChatHistory: PropTypes.bool.isRequired,
  hideZendeskLogo: PropTypes.bool,
  initiateSocialLogout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loginSettings: PropTypes.object.isRequired,
  offlineMessage: PropTypes.object.isRequired,
  openedChatHistory: PropTypes.func.isRequired,
  operatingHours: PropTypes.object,
  readOnlyState: PropTypes.object.isRequired,
  sendOfflineMessage: PropTypes.func.isRequired,
  socialLogin: PropTypes.object.isRequired,
  theme: PropTypes.shape({ isMobile: PropTypes.bool }),
  title: PropTypes.string.isRequired,
  visitor: PropTypes.object.isRequired,
  widgetShown: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  authUrls: getAuthUrls(state),
  chatHistoryLabel: getChatHistoryLabel(state),
  formFields: getOfflineFormFields(state),
  formSettings: getOfflineFormSettings(state),
  formState: getChatOfflineForm(state),
  hasChatHistory: getHasChatHistory(state),
  hideZendeskLogo: getHideZendeskLogo(state),
  isAuthenticated: getIsAuthenticated(state),
  loginSettings: getLoginSettings(state),
  offlineMessage: getOfflineMessage(state),
  operatingHours: getGroupedOperatingHours(state),
  readOnlyState: getReadOnlyState(state),
  socialLogin: getSocialLogin(state),
  title: getChatTitle(state),
  visitor: getChatVisitor(state),
  widgetShown: getWidgetShown(state)
})

const actionCreators = {
  cancelButtonClicked,
  chatOfflineFormChanged,
  getGroupedOperatingHours,
  handleOperatingHoursClick,
  initiateSocialLogout,
  openedChatHistory,
  sendOfflineMessage
}

const themedComponent = withTheme(ChatOffline)

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(themedComponent)

export { connectedComponent as default, themedComponent as Component }
