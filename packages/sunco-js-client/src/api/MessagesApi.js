import { getClientInfo, getSessionId } from '../utils/device'
import storage from '../utils/storage'
import BaseApi from './BaseApi'

class MessagesApi extends BaseApi {
  list(appUserId, conversationId, params = {}) {
    return this.request({
      method: 'GET',
      path: `/v2/apps/${this.appId}/conversations/${conversationId}/messages`,
      params,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`,
      },
    })
  }

  create(appUserId, conversationId, payload) {
    const messagePayload = {
      message: payload,
      author: {
        role: 'appUser',
        appUserId: appUserId,
        client: getClientInfo(this.integrationId),
        sessionId: getSessionId(this.integrationId),
      },
    }

    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/conversations/${conversationId}/messages`,
      data: messagePayload,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`,
      },
    })
  }
}

export default MessagesApi
