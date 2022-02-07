import Sunco from '@zendesk/sunco-js-client'
import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'

const PROD_URL = 'https://api.smooch.io'

let client
export const setupSuncoClient = ({ integrationId, appId, baseUrl, conversationHistory } = {}) => {
  const storageType = conversationHistory === 'remember' ? 'localStorage' : 'sessionStorage'
  const url = isFeatureEnabled({}, 'use_production_sunco') ? PROD_URL : baseUrl

  client = new Sunco({
    integrationId,
    appId,
    baseUrl: url,
    storageType,
    debug: __DEV__,
  })

  if (__DEV__) {
    window.parent.client = window.client = client
  }

  return client
}

export const forgetUserAndDisconnect = () => {
  client?.forgetUser()
}

export const getClient = () => client

export const hasExistingAppUser = () => getClient().hasExistingAppUser

export const hasExistingConversation = () =>
  hasExistingAppUser() && getClient().hasExistingActiveConversation

export const getActiveConversation = async () => {
  return await getClient().getOrStartConversation()
}

export const sendStartTyping = async () => {
  const conversation = await getActiveConversation()
  return conversation.startTyping()
}

export const sendStopTyping = async () => {
  const conversation = await getActiveConversation()
  return conversation.stopTyping()
}

export const sendConversationRead = async () => {
  const conversation = await getActiveConversation()
  return conversation.conversationRead()
}

export const fetchMessages = async (cursor) => {
  const conversation = await getActiveConversation()
  return conversation.listMessages(cursor)
}

export const sendMessage = async (message, payload, metadata) => {
  const conversation = await getActiveConversation()
  return conversation.sendMessage(message, payload, metadata)
}

export const sendFile = async (file) => {
  const conversation = await getActiveConversation()
  return conversation.sendFile(file)
}

export const sendFormResponse = async (fields, formId) => {
  const conversation = await getActiveConversation()
  return conversation.sendFormResponse(fields, formId)
}

export const updateSession = async (appUser) => {
  getClient().updateSession(appUser)
}

export const setLocale = async (locale) => {
  getClient().setLocale(locale)
}

export const fetchLinkRequest = async (integrationId) => {
  const conversation = await getActiveConversation()
  return conversation.getLinkRequest(integrationId)
}

export const unlinkIntegration = async (integrationId) => {
  const conversation = await getActiveConversation()
  return conversation.unlinkIntegration(integrationId)
}

// Temporary API until we can get this data via embeddable config
export const fetchIntegrations = async () => {
  return getClient().getIntegrations()
}

export const loginUser = (generateJwtCallback) => {
  return getClient().loginUser(generateJwtCallback)
}

export const logoutUser = () => {
  return getClient().logoutUser()
}
