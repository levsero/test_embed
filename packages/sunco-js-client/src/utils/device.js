import { v4 as uuidv4 } from 'uuid'
import { VENDOR_ID, VERSION } from './constants'
import storage from './storage'

export function getClientId(integrationId) {
  const key = `${integrationId}.clientId`

  const clientId = storage.getItem(key) || uuidv4().replace(/-/g, '')
  storage.setItem(key, clientId)

  return clientId
}

export function removeClientId(integrationId) {
  const key = `${integrationId}.clientId`

  storage.removeItem(key)
}

export function getClientInfo(integrationId) {
  const { document: _document, navigator } = parent
  const href = _document.location && _document.location.href
  const host = _document.location && _document.location.host

  return {
    platform: 'web', //required
    id: getClientId(integrationId), //required
    integrationId, //required
    info: {
      vendor: `${VENDOR_ID}`,
      sdkVersion: `${VERSION}`,
      URL: host,
      userAgent: navigator.userAgent,
      referrer: _document.referrer,
      browserLanguage: navigator.language,
      currentUrl: href,
      currentTitle: _document.title,
    },
  }
}

let sessionId
export function getSessionId(integrationId) {
  if (sessionId) return sessionId
  if (storage.getItem(`${integrationId}.sessionToken`)) {
    sessionId = storage.getItem(`${integrationId}.sessionToken`)
  } else {
    sessionId = uuidv4()
  }
  return sessionId
}
