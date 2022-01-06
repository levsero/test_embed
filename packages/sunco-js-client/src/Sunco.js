import decodeJwt from 'jwt-decode'
import AppUser from 'src/AppUser'
import ActivityAPI from './api/ActivityApi'
import AppUsersApi from './api/AppUsersApi'
import ConversationsApi from './api/ConversationsApi'
import IntegrationsApi from './api/IntegrationsApi'
import MessagesApi from './api/MessagesApi'
import SocketClient from './socket/SocketClient'
import retryWrapper from './utils/retries'
import storage, { DEFAULT_STORAGE_TYPE } from './utils/storage'

const BASE_URL = 'https://api.smooch.io'
const MAX_RETRIES = 2
const DELAY_BETWEEN_RETRIES = 500

export default class Sunco {
  constructor({
    appId,
    integrationId,
    baseUrl = BASE_URL,
    storageType = DEFAULT_STORAGE_TYPE,
    debug = false,
  }) {
    const sdkInBaseUrl = baseUrl.indexOf('/sdk') !== -1
    this.baseUrl = sdkInBaseUrl ? baseUrl : `${baseUrl}/sdk`
    this.appId = appId
    this.integrationId = integrationId
    this._activeConversation = null
    storage.setStorageType({ type: storageType })
    this.locale = null
    this.debug = debug

    this.user = new AppUser(this)

    this.appUsers = new AppUsersApi(this)
    this.conversations = new ConversationsApi(this)
    this.messages = new MessagesApi(this)
    this.activity = new ActivityAPI(this)
    this.integrations = new IntegrationsApi(this)
  }

  get hasExistingAppUser() {
    const { appUserId } = this.user.getCurrentAppUserIfAny()
    return Boolean(appUserId)
  }

  get hasExistingActiveConversation() {
    return Boolean(this._activeConversation)
  }

  get activeConversation() {
    if (this._activeConversation === null) {
      throw "There is no activeConversation available. Try running 'client.startConversation()' first"
    }
    return this._activeConversation
  }

  set activeConversation({ conversationId, socketSettings, lastRead, integrations }) {
    const { appUserId } = this.user.getCurrentAppUserIfAny()

    if (this.debug) {
      /* eslint no-console:0 */
      console.log(`appId: ${this.appId}  conversationId: ${conversationId}`)
    }

    const socketClient = new SocketClient({
      ...socketSettings,
      appId: this.appId,
      user: this.user,
    })

    this._activeConversation = {
      appUserId,
      conversationId,
      integrations,
      lastRead,
      socketClient,
      listMessages: (cursor) => {
        const params = {}
        if (cursor) params['before'] = cursor
        return this.messages.list(appUserId, conversationId, params)
      },
      sendMessage: (text, payload, metadata) =>
        this.messages.create(appUserId, conversationId, {
          type: 'text',
          text,
          role: 'appUser',
          payload,
          metadata,
        }),
      sendFile: (file) => this.messages.sendFile(appUserId, conversationId, file),
      sendFormResponse: (fields, formId) =>
        this.messages.create(appUserId, conversationId, {
          fields: fields,
          quotedMessageId: formId,
          type: 'formResponse',
          role: 'appUser',
        }),
      startTyping: () => this.activity.create(appUserId, conversationId, { type: 'typing:start' }),
      stopTyping: () => this.activity.create(appUserId, conversationId, { type: 'typing:stop' }),
      conversationRead: () =>
        this.activity.create(appUserId, conversationId, { type: 'conversation:read' }),
      stopConversation: () => {
        socketClient.unsubscribe()
        this._activeConversation = null
        this.conversationPromise = null
      },
      getLinkRequest: (integrationId) => this.appUsers.getLinkRequest(appUserId, integrationId),
      unlinkIntegration: (clientId) => this.appUsers.unlinkIntegration(appUserId, clientId),
    }
  }

  startConversation() {
    if (this.hasExistingActiveConversation) return this.activeConversation
    if (this.conversationPromise) return this.conversationPromise

    this.conversationPromise = retryWrapper(
      () =>
        new Promise((resolve, reject) => {
          const { appUserId } = this.user.getCurrentAppUserIfAny()
          if (appUserId) {
            this.appUsers
              .get(appUserId)
              .then((response) => {
                if (!response.body.appUser.conversationStarted) {
                  resolve(this.createConversation())
                } else {
                  this.setActiveConversationFromResponse(response)
                }
                resolve(this.activeConversation)
              })
              .catch((error) => {
                const { status } = error

                switch (status) {
                  case 401:
                    this.user.removeAppUser()
                    return resolve(this.createAppUser())
                  default:
                    reject(error)
                }
              })
          } else {
            resolve(this.createAppUser())
          }
        }),
      DELAY_BETWEEN_RETRIES,
      MAX_RETRIES
    ).catch(() => {
      // When any of the promises in this retry wrapper are rejected, eg. from a failed request,
      // setting the conversationPromise back to null will allow users to 'try again'
      this.conversationPromise = null
    })

    return this.conversationPromise
  }

  setLocale(locale) {
    this.locale = locale

    const { appUserId } = this.user.getCurrentAppUserIfAny()
    if (appUserId) {
      this.startConversation()
    }
    if (this.conversationPromise) {
      this.conversationPromise.then((response) => {
        this.appUsers.update(response.appUserId, { locale })
      })
    }
  }

  createAppUser = () => {
    return new Promise((resolve, reject) => {
      this.appUsers
        .create({ ...(this.locale ? { locale: this.locale } : {}) })
        .then((response) => {
          this.user.updateAppUser({
            appUserId: response.body.appUser._id,
            sessionToken: response.body.sessionToken,
          })
          this.setActiveConversationFromResponse(response)
          resolve(this.activeConversation)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  createConversation = () => {
    return new Promise((resolve, reject) => {
      const { appUserId } = this.user.getCurrentAppUserIfAny(this.integrationId)
      this.conversations
        .create(appUserId)
        .then((response) => {
          this.setActiveConversationFromResponse(response)
          resolve(this.activeConversation)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  getIntegrations() {
    return this.integrations.get()
  }

  wasMessageSentFromThisTab(message) {
    const { sessionId, clientId } = this.user.getCurrentAppUserIfAny()

    if (message.source.id !== clientId) return false
    return message.source.sessionId === sessionId
  }

  updateSession(appUser) {
    const { _id: appUserId, sessionToken } = appUser
    this.user.updateAppUser({ appUserId, sessionToken })
  }

  setClientId(clientId) {
    this.user.updateAppUser({
      clientId,
    })
  }

  forgetUser() {
    this.user.removeAppUser()
  }

  getClientId() {
    const { clientId } = this.user.getCurrentAppUserIfAny()
    return clientId
  }

  setActiveConversationFromResponse(response) {
    this.activeConversation = {
      conversationId: response.body.conversations[0]._id,
      socketSettings: response.body.settings.realtime,
      lastRead: response.body.conversations[0]?.participants[0]?.lastRead,
      integrations: response.body.appUser.clients?.filter((client) => client.platform !== 'web'),
    } // TODO - might need to eventually select a particular conversation - isDefault: true
  }

  async loginUser(newJwtCallback) {
    const { externalId } = this.user.getCurrentAppUserIfAny()

    let newExternalId = null,
      jwt = null

    try {
      jwt = await this.user.getJWTFromCallback(newJwtCallback)
      newExternalId = decodeJwt(jwt).external_id
    } catch (err) {
      throw new Error('Unable to read external_id from JWT token')
    }

    const hasExternalIdChanged = Boolean(externalId && externalId !== newExternalId)

    if (hasExternalIdChanged) {
      await this.logoutUser()
    }

    this.user.updateAppUser({
      getJWT: newJwtCallback,
      externalId: newExternalId,
      jwt,
    })

    const { appUserId } = this.user.getCurrentAppUserIfAny()

    return new Promise((resolve, reject) => {
      this.appUsers
        .login(appUserId, newExternalId)
        .then((response) => {
          if (response.body.appUser.conversationStarted) {
            this.setActiveConversationFromResponse(response)
          }
          this.user.updateAppUser({
            appUserId: response.body.appUser._id,
          })
          resolve({ hasExternalIdChanged })
        })
        .catch((error) => {
          reject({ message: 'Error while attempting to login', error })
        })
    })
  }

  logoutUser() {
    const { appUserId, jwt } = this.user.getCurrentAppUserIfAny()

    return new Promise((resolve, reject) => {
      if (appUserId && jwt) {
        this.appUsers
          .logout(appUserId)
          .then(() => {
            this._activeConversation?.stopConversation()
            this.forgetUser()
            resolve()
          })
          .catch((error) => {
            reject({ message: 'Error while attempting to logout', error })
          })
      } else {
        reject({ message: 'No user to log out' })
      }
    })
  }
}
