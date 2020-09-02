import BaseApi from './BaseApi'
import { getClientInfo, getSessionId } from '../utils/device'
import storage from '../utils/storage'

class MessagesApi extends BaseApi {
  list(appUserId, conversationId) {
    return this.request({
      method: 'GET',
      path: `/sdk/v2/apps/${this.appId}/conversations/${conversationId}/messages`,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`
      }
    })
  }

  create(appUserId, conversationId, message) {
    const messagePayload = {
      message: {
        type: 'text',
        text: message,
        role: 'appUser'
      },
      author: {
        role: 'appUser',
        appUserId: appUserId,
        client: getClientInfo(this.integrationId),
        sessionId: getSessionId()
      }
    }

    return this.request({
      method: 'POST',
      path: `/sdk/v2/apps/${this.appId}/conversations/${conversationId}/messages`,
      data: messagePayload,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`
      }
    })
  }
}

export default MessagesApi
