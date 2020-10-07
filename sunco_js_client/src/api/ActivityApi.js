import BaseApi from './BaseApi'
import { getClientInfo, getSessionId } from '../utils/device'
import storage from '../utils/storage'

class MessagesApi extends BaseApi {
  constructor(options, appUserId, conversationId) {
    super(options)
    this.appUserId = appUserId
    this.conversationId = conversationId
  }

  sendActivity(activity) {
    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/conversations/${this.conversationId}/activity`,

      headers: {
        Authorization: `Basic ${btoa(
          `${this.appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`
      },
      data: {
        author: {
          role: 'appUser',
          appUserId: this.appUserId,
          client: getClientInfo(this.integrationId),
          sessionId: getSessionId()
        },
        activity
      }
    })
  }

  startTyping() {
    return this.sendActivity({ type: 'typing:start' })
  }

  stopTyping() {
    return this.sendActivity({ type: 'typing:stop' })
  }

  conversationRead() {
    return this.sendActivity({ type: 'conversation:read' })
  }
}

export default MessagesApi
