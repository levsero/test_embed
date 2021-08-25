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
      author: this.getAuthorInformation(appUserId),
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

  sendFile(appUserId, conversationId, file) {
    const data = new FormData()
    data.append('author', JSON.stringify(this.getAuthorInformation(appUserId)))
    data.append('message', JSON.stringify({}))
    data.append('source', file)

    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/conversations/${conversationId}/files`,
      data,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`,

        // Content-Type will get set by superagent automatically when FormData is provided
        'Content-Type': undefined,
      },
    })
  }

  getAuthorInformation(appUserId) {
    return {
      role: 'appUser',
      appUserId: appUserId,
      client: getClientInfo(this.integrationId),
      sessionId: getSessionId(this.integrationId),
    }
  }
}

export default MessagesApi
