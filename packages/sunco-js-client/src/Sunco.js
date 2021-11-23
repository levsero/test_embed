import decodeJwt from 'jwt-decode'
import LoginApi from 'src/api/LoginApi'
import ActivityAPI from './api/ActivityApi'
import AppUsersApi from './api/AppUsersApi'
import ConversationsApi from './api/ConversationsApi'
import IntegrationsApi from './api/IntegrationsApi'
import MessagesApi from './api/MessagesApi'
import SocketClient from './socket/SocketClient'
import { getCurrentUserIfAny, removeAppUser, storeAppUser } from './utils/context'
import {
  getOrCreateClientId,
  getSessionId,
  removeClientId,
  setClientId as setClientIdInStorage,
} from './utils/device'
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
    this.auth = {
      jwt: null,
      generateJwtCallback: null,
    }

    this.appUsers = new AppUsersApi(this)
    this.conversations = new ConversationsApi(this)
    this.messages = new MessagesApi(this)
    this.activity = new ActivityAPI(this)
    this.integrations = new IntegrationsApi(this)

    getOrCreateClientId(integrationId)
    this.login = new LoginApi(this)
  }

  get hasExistingAppUser() {
    const { appUserId } = getCurrentUserIfAny(this.integrationId)
    return Boolean(appUserId)
  }

  login(jwt) {
    this.auth.jwt = jwt
  }

  get activeConversation() {
    if (this._activeConversation === null) {
      throw "There is no activeConversation available. Try running 'client.startConversation()' first"
    }
    return this._activeConversation
  }

  set activeConversation({ conversationId, socketSettings, lastRead, integrations }) {
    const { appUserId } = getCurrentUserIfAny(this.integrationId)

    if (this.debug) {
      /* eslint no-console:0 */
      console.log(`appId: ${this.appId}  conversationId: ${conversationId}`)
    }

    const socketClient = new SocketClient({
      ...socketSettings,
      appId: this.appId,
      appUserId: appUserId,
      auth: this.auth,
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
    this.conversationPromise =
      this.conversationPromise ||
      retryWrapper(
        () =>
          new Promise((resolve, reject) => {
            const { appUserId } = getCurrentUserIfAny(this.integrationId)
            if (appUserId) {
              this.appUsers
                .get(appUserId)
                .then((response) => {
                  this.activeConversation = {
                    conversationId: response.body.conversations[0]._id,
                    socketSettings: response.body.settings.realtime,
                    lastRead: response.body.conversations[0]?.participants[0]?.lastRead,
                    integrations: response.body.appUser.clients.filter(
                      (client) => client.platform !== 'web'
                    ),
                  } // TODO - might need to eventually select a particular conversation - isDefault: true
                  resolve(this.activeConversation)
                })
                .catch((error) => {
                  const { status } = error

                  switch (status) {
                    case 401:
                      removeAppUser({ integrationId: this.integrationId })
                      return resolve(this.createAppUser())
                    default:
                      reject()
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

    const { appUserId } = getCurrentUserIfAny(this.integrationId)
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
          storeAppUser({
            appUserId: response.body.appUser._id,
            sessionToken: response.body.sessionToken,
            integrationId: this.integrationId,
          })
          this.activeConversation = {
            conversationId: response.body.conversations[0]._id,
            socketSettings: response.body.settings.realtime,
            integrations: response.body.appUser.clients?.filter(
              (client) => client.platform !== 'web'
            ),
          }
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
    if (message.source.id !== getOrCreateClientId(this.integrationId)) return false
    return message.source.sessionId === getSessionId(this.integrationId)
  }

  updateSession(appUser) {
    const { _id: appUserId, sessionToken } = appUser
    storeAppUser({ appUserId, sessionToken, integrationId: this.integrationId })
  }

  setClientId(clientId) {
    setClientIdInStorage(this.integrationId, clientId)
  }

  forgetUser() {
    removeAppUser({ integrationId: this.integrationId })
    removeClientId(this.integrationId)
  }

  getClientId(integrationId) {
    return getOrCreateClientId(integrationId)
  }

  loginUser(generateJwtCallback) {
    this.auth.generateJwtCallback = generateJwtCallback
    this.auth.jwt = generateJwtCallback()

    // const { external_id, name, email } = decodeJwt(this.auth.jwt)
    // eslint-disable-next-line babel/camelcase
    const { external_id } = decodeJwt(this.auth.jwt)
    const { appUserId } = getCurrentUserIfAny(this.integrationId)

    this.login
      .create(appUserId, external_id, this.auth.jwt)
      .then((response) => {
        // if JWT  has name and/or email
        // Call PUT this.appUsers.update({givenName, email})

        // if we have a conversation with this user, store appUserId and conversation details
        if (response.body.conversations.length) {
          this.activeConversation = {
            conversationId: response.body.conversations[0]._id,
            socketSettings: response.body.settings.realtime,
            lastRead: response.body.conversations[0]?.participants[0]?.lastRead,
            integrations: response.body.appUser.clients.filter(
              (client) => client.platform !== 'web'
            ),
          } // TODO - might need to eventually select a particular conversation - isDefault: true
        } else {
          console.log('no conversations, storing appUserId')
          // store the app user ID
          // Don't create a conversation until the user tries to start one by opening the widget.
          storeAppUser({
            appUserId: response.body.appUser._id,
            sessionToken: response.body.sessionToken,
            integrationId: this.integrationId,
          })
        }
      })
      .catch(() => {})
  }
}
