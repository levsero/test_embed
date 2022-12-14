import { isTokenValid } from 'classicSrc/redux/modules/base/helpers/auth'
import _ from 'lodash'
import { createSelector } from 'reselect'
import { persistence as store } from '@zendesk/widget-shared-services'
import { win } from '@zendesk/widget-shared-services'

export const getHiddenByHideAPI = (state) => state.base.hidden.hideApi
export const getHiddenByActivateAPI = (state) => state.base.hidden.activateApi
export const getSubmitTicketEmbed = (state) => !!state.base.embeds.ticketSubmissionForm
export const getChatEmbed = (state) => !!state.base.embeds.chat
export const getHelpCenterEmbed = (state) => !!state.base.embeds.helpCenterForm
export const getTalkEmbed = (state) => !!state.base.embeds.talk
export const getActiveEmbed = (state) => state.base.activeEmbed
export const getWidgetShown = (state) => state.base.widgetShown
export const getIPMWidget = (state) => !!state.base.embeds.ipmWidget
export const getOnApiListeners = (state) => state.base.onApiListeners
export const getWidgetInitialised = (state) => state.base.widgetInitialised
export const getBootupTimeout = (state) => state.base.bootupTimeout
export const getWebWidgetOpen = (state) => state.base.webWidgetOpen
export const getLauncherVisible = (state) => state.base.launcherVisible
export const getLocale = (state) => state.base.locale
export const getIsChatBadgeMinimized = (state) => state.base.isChatBadgeMinimized
export const getAfterWidgetShowAnimation = (state) => state.base.afterWidgetShowAnimation
export const getChatConfig = (state) => state.base.embeddableConfig.embeds.chat
export const getTalkConfig = (state) => state.base.embeddableConfig.embeds.talk
export const getBrandLogoUrl = (state) => state.base.embeddableConfig.brandLogoUrl
export const getBrand = (state) => state.base.embeddableConfig.brand
export const getBrandCount = (state) => state.base.embeddableConfig.brandCount
export const getBackButtonVisible = (state) => state.base.backButtonVisible
export const getWidgetAlreadyHidden = (state) => {
  return getHiddenByHideAPI(state) || (getHiddenByActivateAPI(state) && !getWebWidgetOpen(state))
}

export const getOAuth = () => {
  return store.get('zE_oauth')
}

export const getAuthToken = () => {
  const oauth = getOAuth()

  return oauth && oauth.token ? oauth.token : null
}
export const getHasWidgetShown = (state) => state.base.hasWidgetShown
export const getBaseIsAuthenticated = () => isTokenValid(getOAuth())
export const getIsAuthenticationPending = (state) => state.base.isAuthenticationPending
export const getEmbeddableConfig = (state) => state.base.embeddableConfig
export const getConfigAttachmentsEnabled = (state) => {
  return getEmbeddableConfig(state).embeds.ticketSubmissionForm.props.attachmentsEnabled
}
export const getConfigNameFieldEnabled = (state) => {
  return getEmbeddableConfig(state).embeds.ticketSubmissionForm.props.nameFieldEnabled
}
export const getConfigNameFieldRequired = (state) => {
  return getEmbeddableConfig(state).embeds.ticketSubmissionForm.props.nameFieldRequired
}
export const getTicketFormsEnabled = (state) => {
  return getEmbeddableConfig(state).embeds.ticketSubmissionForm.props.ticketFormsEnabled
}
export const getCustomFieldIds = (state) => {
  return getEmbeddableConfig(state).embeds.ticketSubmissionForm.props.customFields || {}
}
export const getCustomFieldsAvailable = (state) => {
  const embeddableConfig = getEmbeddableConfig(state)
  return (
    _.has(embeddableConfig, 'embeds.ticketSubmissionForm.props.customFields.ids') ||
    _.has(embeddableConfig, 'embeds.ticketSubmissionForm.props.customFields.all')
  )
}
export const getChatStandalone = createSelector(getEmbeddableConfig, (embeddableConfig) => {
  return embeddableConfig.embeds.chat.props.standalone
})

export const getQueue = (state) => state.base.queue

export const getZopimId = createSelector([getEmbeddableConfig], (embeddableConfig) => {
  return embeddableConfig.embeds.chat.props.zopimId
})

export const getFormTitleKey = createSelector(getEmbeddableConfig, (embeddableConfig) =>
  _.get(embeddableConfig, 'embeds.ticketSubmissionForm.props.formTitleKey', 'message')
)

export const getConfigColorBase = createSelector(
  [getEmbeddableConfig],
  (embeddableConfig) => embeddableConfig.color
)

export const getConfigColorText = createSelector(
  [getEmbeddableConfig],
  (embeddableConfig) => embeddableConfig.textColor
)
export const getChatOverrideProxy = createSelector([getEmbeddableConfig], (embeddableConfig) => {
  return embeddableConfig.embeds.chat.props.overrideProxy
})
export const getZChatConfig = createSelector(
  [getZopimId, getChatOverrideProxy],
  (zopimId, overrideProxy) => {
    return {
      account_key: zopimId,
      activity_window: win,
      ...(overrideProxy && { override_proxy: overrideProxy }),
    }
  }
)
