import storage, { DEFAULT_STORAGE_TYPE } from './utils/storage'
import AppUsersApi from './api/AppUsersApi'
import ConversationsApi from './api/ConversationsApi'
import MessagesApi from './api/MessagesApi'
import ActivityAPI from './api/ActivityApi'
import SocketClient from './socket/SocketClient'
import { getCurrentUserIfAny, storeAppUser } from './utils/context'
import { getClientId, getSessionId } from './utils/device'

const BASE_URL = 'https://api.smooch.io'

export default class Sunco {
  constructor({ appId, integrationId, baseUrl = BASE_URL, storageType = DEFAULT_STORAGE_TYPE }) {
    const sdkInBaseUrl = baseUrl.endsWith('/sdk')
    this.baseUrl = sdkInBaseUrl ? baseUrl : `${baseUrl}/sdk`
    this.appId = appId
    this.integrationId = integrationId
    this._activeConversation = null
    storage.setStorageType({ type: storageType })

    this.appUsers = new AppUsersApi(this)
    this.conversations = new ConversationsApi(this)
    this.messages = new MessagesApi(this)
    this.activity = new ActivityAPI(this)
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

    if (__DEV__) {
      /* eslint no-console:0 */
      console.log(`appId: ${this.appId}  conversationId: ${conversationId}`)
    }

    this._activeConversation = {
      appUserId,
      conversationId,
      lastRead,
      socketClient: new SocketClient({
        ...socketSettings,
        appId: this.appId,
        appUserId: appUserId,
        sessionToken: sessionToken
      }),
      listMessages: cursor => {
        const params = {}
        if (cursor) params['before'] = cursor
        return this.messages.list(appUserId, conversationId, params)
      },
      sendMessage: (text, payload) =>
        this.messages.create(appUserId, conversationId, {
          type: 'text',
          text,
          role: 'appUser',
          payload
        }),
      sendFormResponse: (fields, formId) =>
        this.messages.create(appUserId, conversationId, {
          fields: fields,
          quotedMessageId: formId,
          type: 'formResponse',
          role: 'appUser'
        }),
      startTyping: () => this.activity.create(appUserId, conversationId, { type: 'typing:start' }),
      stopTyping: () => this.activity.create(appUserId, conversationId, { type: 'typing:stop' }),
      conversationRead: () =>
        this.activity.create(appUserId, conversationId, { type: 'conversation:read' })
    }
  }

  startConversation() {
    this.conversationPromise =
      this.conversationPromise ||
      new Promise((resolve, _reject) => {
        const { appUserId } = getCurrentUserIfAny(this.integrationId)

        if (appUserId) {
          this.appUsers.get(appUserId).then(response => {
            this.activeConversation = {
              appUserId,
              conversationId: response.body.conversations[0]._id,
              socketSettings: response.body.settings.realtime,
              lastRead: response.body.conversations[0]?.participants[0]?.lastRead
            } // TODO - might need to eventually select a particular conversation - isDefault: true
            resolve(this.activeConversation)
          })
        } else {
          this.appUsers.create().then(response => {
            storeAppUser({
              appUserId: response.body.appUser._id,
              sessionToken: response.body.sessionToken,
              integrationId: this.integrationId
            })
            this.activeConversation = {
              appUserId,
              conversationId: response.body.conversations[0]._id,
              socketSettings: response.body.settings.realtime
            } // TODO - might need to eventually select a particular conversation - isDefault: true
            resolve(this.activeConversation)
          })
        }
      })
    return this.conversationPromise
  }

  wasMessageSentFromThisTab(message) {
    if (message.source.id !== getClientId(this.integrationId)) return false
    return message.source.sessionId === getSessionId(this.integrationId)
  }
}
