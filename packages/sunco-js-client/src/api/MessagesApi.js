import { MAX_FILE_SIZE_IN_BYTES } from '../utils/constants'
import { getClientInfo, getSessionId } from '../utils/device'
import storage from '../utils/storage'
import SuncoAPIError from './../utils/SuncoAPIError'
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
    if (file.size > MAX_FILE_SIZE_IN_BYTES) {
      throw new SuncoAPIError('File size is too large', {
        reason: 'fileSize',
        fileSize: file.size,
        limit: MAX_FILE_SIZE_IN_BYTES,
      })
    }

    const data = new FormData()

    const castFile = new File([file], file.name, { type: file.type })

    data.append('author', JSON.stringify(this.getAuthorInformation(appUserId)))
    data.append('message', JSON.stringify({}))
    data.append('source', castFile)

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
