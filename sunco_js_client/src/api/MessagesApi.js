import BaseApi from './BaseApi'
import { getClientInfo, getSessionId } from '../utils/device'
import storage from '../utils/storage'

class MessagesApi extends BaseApi {
  list(appUserId, conversationId, cursor) {
    const cursorPagination = cursor ? `before=${cursor}` : ''
    return this.request({
      method: 'GET',
      path: `/v2/apps/${this.appId}/conversations/${conversationId}/messages?${cursorPagination}`,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`
      }
    })
  }

  create(appUserId, conversationId, payload) {
    const messagePayload = {
      message: payload,
      author: {
        role: 'appUser',
        appUserId: appUserId,
        client: getClientInfo(this.integrationId),
        sessionId: getSessionId()
      }
    }

    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/conversations/${conversationId}/messages`,
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
