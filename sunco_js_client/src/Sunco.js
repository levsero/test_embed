import AppUsersApi from './api/AppUsersApi'
import ConversationsApi from './api/ConversationsApi'
import MessagesApi from './api/MessagesApi'
import IntegrationsApi from './api/IntegrationsApi'
import SocketClient from './socket/SocketClient'
import { getCurrentUserIfAny, storeAppUser } from './utils/context'

const BASE_URL = 'https://api.smooch.io'

export default class Sunco {
  constructor(options = {}) {
    const { baseUrl = BASE_URL, appId, integrationId } = options

    this.baseUrl = baseUrl
    this.appId = appId
    this.integrationId = integrationId
    this._activeConversation = null

    this.appUsers = new AppUsersApi(this)
    this.conversations = new ConversationsApi(this)
    this.messages = new MessagesApi(this)
    this.integrations = new IntegrationsApi(this) //temp - will remove
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
      listMessages: () => this.messages.list(appUserId, conversationId),
      sendMessage: message => this.messages.create(appUserId, conversationId, message)
    }
  }

  startConversation() {
    return new Promise((resolve, _reject) => {
      const { appUserId } = getCurrentUserIfAny(this.integrationId)

      if (appUserId) {
        this.appUsers.get(appUserId).then(response => {
          this.activeConversation = {
            appUserId,
            conversationId: response.body.conversations[0]._id,
            socketSettings: response.body.settings.realtime
          } // fix this to select isDefault: true
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
          } // fix this to select isDefault: true
          resolve(this.activeConversation)
        })
      }
    })
  }

  sendMessage(message) {
    return this.activeConversation.sendMessage(message)
  }

  listMessages() {
    return this.activeConversation.listMessages()
  }

  subscribe(callback) {
    return this.activeConversation.socketClient.subscribe(callback)
  }
}
