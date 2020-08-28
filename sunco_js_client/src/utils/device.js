import { v4 as uuidv4 } from 'uuid'

import { VENDOR_ID, VERSION } from './constants'
import storage from './storage'

// export function verifyStoredClientId(appUser, integrationId) {
//   const storedClientId = storage.getItem(`${integrationId}.clientId`);
//   const isStoredClientIdValid = appUser.clients.some((client) => {
//     return client.id === storedClientId && client.platform === 'web' && client.active;
//   });
//   if (!isStoredClientIdValid) {
//     throw new Error(CLIENT_ID_ERROR);
//   }
// }

export function getClientId(integrationId) {
  const key = `${integrationId}.clientId`

  const clientId = storage.getItem(key) || uuidv4().replace(/-/g, '')
  storage.setItem(key, clientId)

  return clientId
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
      currentTitle: _document.title
    }
  }
}

// Fix this to support multiple concurrent client instances
let sessionId
export function getSessionId() {
  if (!sessionId) {
    sessionId = uuidv4()
  }

  return sessionId
}
