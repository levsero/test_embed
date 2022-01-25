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
    this.externalId = null
    this.refetchedTokens = {}
    this.refetchJWTPromise = null
  }

  getCurrentAppUserIfAny() {
    let sessionToken = storage.getItem(`${this.integrationId}.sessionToken`)
    let appUserId = storage.getItem(`${this.integrationId}.appUserId`)
    const clientId = getOrCreateClientId(this.integrationId)

    if (this.jwt || this.getJWT) {
      return {
        ...(sessionToken && { sessionToken }),
        appUserId,
        clientId,
        jwt: this.jwt,
        getJWT: this.getJWT,
        externalId: this.externalId,
      }
    }

    return { sessionToken, appUserId, clientId }
  }

  updateAppUser({ appUserId, sessionToken, getJWT, clientId, externalId, jwt }) {
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
    if (externalId) {
      this.externalId = externalId
    }
    if (jwt) {
      this.jwt = jwt
    }
  }

  clearSessionToken() {
    storage.removeItem(`${this.integrationId}.sessionToken`)
  }

  removeAppUser() {
    storage.removeItem(`${this.integrationId}.appUserId`)
    storage.removeItem(`${this.integrationId}.sessionToken`)
    storage.removeItem(`${this.integrationId}.clientId`)
    this.jwt = null
    this.getJWT = null
    this.externalId = null
    this.refetchedTokens = {}
    this.refetchJWTPromise = null
  }

  async generateJWT() {
    if (!this.getJWT) {
      throw new Error('no JWT provided')
    }

    return await this.getJWTFromCallback(this.getJWT).then((jwt) => {
      this.jwt = jwt
    })
  }

  refetchJWT(previousJWT) {
    if (!this.refetchedTokens[previousJWT]) {
      this.refetchedTokens[previousJWT] = true

      this.refetchJWTPromise = new Promise((resolve, reject) => {
        this.generateJWT()
          .then(() => {
            resolve()
          })
          .catch((error) => {
            this.refetchedTokens[previousJWT] = false
            reject(error)
          })
      })
    }

    return this.refetchJWTPromise
  }

  async getJWTFromCallback(jwtCallback) {
    return new Promise((resolve, reject) => {
      try {
        jwtCallback((jwt) => {
          resolve(jwt)
        })
      } catch (err) {
        reject(err)
      }
    }).catch((err) => {
      throw err
    })
  }
}

export default AppUser
