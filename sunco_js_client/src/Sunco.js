import storage, { DEFAULT_STORAGE_TYPE } from './utils/storage'
import SDKConfigApi from './api/SDKConfigApi'
import AppUsersApi from './api/AppUsersApi'
import ConversationsApi from './api/ConversationsApi'
import MessagesApi from './api/MessagesApi'
import SocketClient from './socket/SocketClient'
import { getCurrentUserIfAny, storeAppUser } from './utils/context'

const BASE_URL = 'https://api.smooch.io'

export default class Sunco {
  constructor({ appId, integrationId, baseUrl = BASE_URL, storageType = DEFAULT_STORAGE_TYPE }) {
    this.baseUrl = baseUrl
    this.appId = appId
    this.integrationId = integrationId
    this._activeConversation = null
    storage.setStorageType({ type: storageType }) // TODO - allow value to be sent down in config

    this.SDKConfig = new SDKConfigApi(this) // TODO - Temp api - isn't needed
    this.appUsers = new AppUsersApi(this)
    this.conversations = new ConversationsApi(this)
    this.messages = new MessagesApi(this)
  }

  get activeConversation() {
    if (this._activeConversation === null) {
      throw "There is no activeConversation available. Try running 'client.startConversation()' first"
    }
    return this._activeConversation
  }

  set activeConversation({ conversationId, socketSettings }) {
    const { appUserId, sessionToken } = getCurrentUserIfAny(this.integrationId)
    this._activeConversation = {
      appUserId,
      conversationId,
      socketClient: new SocketClient({
        ...socketSettings,
        appId: this.appId,
        appUserId: appUserId,
        sessionToken: sessionToken
      }),
      listMessages: cursor => this.messages.list(appUserId, conversationId, cursor),
      sendMessage: message =>
        this.messages.create(appUserId, conversationId, {
          type: 'text',
          text: message,
          role: 'appUser'
        }),
      sendFormResponse: (fields, formId) =>
        this.messages.create(appUserId, conversationId, {
          fields: fields,
          quotedMessageId: formId,
          type: 'formResponse',
          role: 'appUser'
        })
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
              socketSettings: response.body.settings.realtime
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

  sendMessage(message) {
    return this.activeConversation.sendMessage(message)
  }

  sendFormResponse(fields, formId) {
    return this.activeConversation.sendFormResponse(fields, formId)
  }

  listMessages(cursor) {
    return this.activeConversation.listMessages(cursor)
  }

  subscribe(callback) {
    return this.activeConversation.socketClient.subscribe(callback)
  }
}
