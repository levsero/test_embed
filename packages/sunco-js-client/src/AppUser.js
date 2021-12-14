import { v4 as uuidv4 } from 'uuid'
import storage from 'src/utils/storage'

function getOrCreateClientId(integrationId) {
  const key = `${integrationId}.clientId`

  const clientId = storage.getItem(key) || uuidv4().replace(/-/g, '')
  storage.setItem(key, clientId)

  return clientId
}

class AppUser {
  constructor(options) {
    this.integrationId = options.integrationId
    this.jwt = null
    this.getJWT = null
  }

  getCurrentAppUserIfAny() {
    let sessionToken = storage.getItem(`${this.integrationId}.sessionToken`)
    let appUserId = storage.getItem(`${this.integrationId}.appUserId`)
    const clientId = getOrCreateClientId(this.integrationId)

    if (this.jwt || this.getJWT) {
      return {
        appUserId,
        clientId,

        jwt: this.jwt,
        getJWT: this.getJWT,
      }
    }

    return { sessionToken, appUserId, clientId }
  }

  updateAppUser({ appUserId, sessionToken, getJWT, clientId }) {
    if (appUserId) {
      storage.setItem(`${this.integrationId}.appUserId`, appUserId)
    }
    if (sessionToken) {
      storage.setItem(`${this.integrationId}.sessionToken`, sessionToken)
    }
    if (clientId) {
      storage.setItem(`${this.integrationId}.clientId`, clientId)
    }
    if (getJWT) {
      this.getJWT = getJWT
    }
  }

  removeAppUser() {
    storage.removeItem(`${this.integrationId}.appUserId`)
    storage.removeItem(`${this.integrationId}.sessionToken`)
    storage.removeItem(`${this.integrationId}.clientId`)
    this.jwt = null
    this.getJWT = null
  }

  async generateJWT() {
    if (!this.getJWT) {
      throw new Error('no JWT provided')
    }

    if (this.currentFetchJWT) {
      return this.currentFetchJWT
    }

    this.currentFetchJWT = new Promise((resolve, reject) => {
      try {
        this.getJWT((jwt) => {
          this.jwt = jwt
          resolve(jwt)
        })
      } catch (err) {
        reject(err)
      }
    }).catch((err) => {
      delete this.currentFetchJWT
      throw err
    })

    return this.currentFetchJWT
  }
}

export default AppUser