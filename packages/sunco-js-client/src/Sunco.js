import ActivityAPI from './api/ActivityApi'
import AppUsersApi from './api/AppUsersApi'
import ConversationsApi from './api/ConversationsApi'
import IntegrationsApi from './api/IntegrationsApi'
import MessagesApi from './api/MessagesApi'
import SocketClient from './socket/SocketClient'
import { getCurrentUserIfAny, storeAppUser, removeAppUser } from './utils/context'
import { getClientId, getSessionId } from './utils/device'
import storage, { DEFAULT_STORAGE_TYPE } from './utils/storage'

const BASE_URL = 'https://api.smooch.io'

export default class Sunco {
  constructor({
    appId,
    integrationId,
    baseUrl = BASE_URL,
    storageType = DEFAULT_STORAGE_TYPE,
    debug = false,
  }) {
    const sdkInBaseUrl = baseUrl.endsWith('/sdk')
    this.baseUrl = sdkInBaseUrl ? baseUrl : `${baseUrl}/sdk`
    this.appId = appId
    this.integrationId = integrationId
    this._activeConversation = null
    storage.setStorageType({ type: storageType })
    this.locale = null
    this.debug = debug

    this.appUsers = new AppUsersApi(this)
    this.conversations = new ConversationsApi(this)
    this.messages = new MessagesApi(this)
    this.activity = new ActivityAPI(this)
    this.integrations = new IntegrationsApi(this)
  }

  get hasExistingAppUser() {
    const { appUserId } = getCurrentUserIfAny(this.integrationId)
    return Boolean(appUserId)
  }

  get activeConversation() {
    if (this._activeConversation === null) {
      throw "There is no activeConversation available. Try running 'client.startConversation()' first"
    }
    return this._activeConversation
  }

  set activeConversation({ conversationId, socketSettings, lastRead }) {
    const { appUserId, sessionToken } = getCurrentUserIfAny(this.integrationId)

    if (this.debug) {
      /* eslint no-console:0 */
      console.log(`appId: ${this.appId}  conversationId: ${conversationId}`)
    }

    const socketClient = new SocketClient({
      ...socketSettings,
      appId: this.appId,
      appUserId: appUserId,
      sessionToken: sessionToken,
    })

    this._activeConversation = {
      appUserId,
      conversationId,
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
      forgetUser: () => {
        removeAppUser({ integrationId: this.integrationId })
      },
      getLinkRequest: (integrationId) => this.appUsers.getLinkRequest(appUserId, integrationId),
      unlinkChannel: (clientId) => this.appUsers.unlinkChannel(appUserId, clientId),
    }
  }

  startConversation() {
    this.conversationPromise =
      this.conversationPromise ||
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
    return new Promise((resolve, _reject) => {
      this.appUsers.create({ ...(this.locale ? { locale: this.locale } : {}) }).then((response) => {
        storeAppUser({
          appUserId: response.body.appUser._id,
          sessionToken: response.body.sessionToken,
          integrationId: this.integrationId,
        })
        this.activeConversation = {
          conversationId: response.body.conversations[0]._id,
          socketSettings: response.body.settings.realtime,
        } // TODO - might need to eventually select a particular conversation - isDefault: true
        resolve(this.activeConversation)
      })
    })
  }

  getIntegrations() {
    return this.integrations.get()
  }

  wasMessageSentFromThisTab(message) {
    if (message.source.id !== getClientId(this.integrationId)) return false
    return message.source.sessionId === getSessionId(this.integrationId)
  }

  updateSession(appUser) {
    const { _id: appUserId, sessionToken } = appUser
    storeAppUser({ appUserId, sessionToken, integrationId: this.integrationId })
  }
}
