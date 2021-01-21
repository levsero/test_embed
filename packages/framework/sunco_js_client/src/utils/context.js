import storage from './storage'

export const getCurrentUserIfAny = integrationId => {
  let sessionToken = storage.getItem(`${integrationId}.sessionToken`)
  let appUserId = storage.getItem(`${integrationId}.appUserId`)
  const clientId = storage.getItem(`${integrationId}.clientId`)

  if (sessionToken && appUserId && !clientId) {
    storage.removeItems(integrationId, ['sessionToken', 'appUserId'])
    sessionToken = null
    appUserId = null
  }

  return { sessionToken, appUserId }
}

export const storeAppUser = ({ appUserId, sessionToken, integrationId }) => {
  if (appUserId) storage.setItem(`${integrationId}.appUserId`, appUserId)
  if (sessionToken) storage.setItem(`${integrationId}.sessionToken`, sessionToken)
}

export const removeAppUser = ({ integrationId }) => {
  storage.removeItem(`${integrationId}.appUserId`)
  storage.removeItem(`${integrationId}.sessionToken`)
}
