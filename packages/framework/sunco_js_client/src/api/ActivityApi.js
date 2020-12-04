import BaseApi from './BaseApi'
import { getClientInfo, getSessionId } from '../utils/device'
import storage from '../utils/storage'

class ActivityApi extends BaseApi {
  create(appUserId, conversationId, activity) {
    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/conversations/${conversationId}/activity`,

      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`
      },
      data: {
        author: {
          role: 'appUser',
          appUserId: appUserId,
          client: getClientInfo(this.integrationId),
          sessionId: getSessionId(this.integrationId)
        },
        activity
      }
    })
  }
}

export default ActivityApi
