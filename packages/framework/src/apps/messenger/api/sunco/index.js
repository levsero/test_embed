import Sunco from 'src/../sunco_js_client/src'
import isFeatureEnabled from 'embeds/webWidget/selectors/feature-flags'

const PROD_URL = 'https://api.smooch.io'

let client
export const setupSuncoClient = ({ integrationId, appId, baseUrl, conversationHistory } = {}) => {
  const storageType = conversationHistory === 'remember' ? 'localStorage' : 'sessionStorage'
  const url = isFeatureEnabled({}, 'use_production_sunco') ? PROD_URL : baseUrl

  client = new Sunco({ integrationId, appId, baseUrl: url, storageType })
  return client
}

export const getClient = () => client

export const hasExistingConversation = () => getClient().hasExistingAppUser

export const getActiveConversation = async () => {
  return await getClient().startConversation()
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

export const fetchMessages = async cursor => {
  const conversation = await getActiveConversation()
  return conversation.listMessages(cursor)
}

export const sendMessage = async (message, payload, metadata) => {
  const conversation = await getActiveConversation()
  return conversation.sendMessage(message, payload, metadata)
}

export const sendFormResponse = async (fields, formId) => {
  const conversation = await getActiveConversation()
  return conversation.sendFormResponse(fields, formId)
}

export const setLocale = async locale => {
  getClient().setLocale(locale)
}
