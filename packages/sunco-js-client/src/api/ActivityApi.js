import { getClientInfo, getSessionId } from '../utils/device'
import BaseApi from './BaseApi'

class ActivityApi extends BaseApi {
  create(appUserId, conversationId, activity) {
    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/conversations/${conversationId}/activity`,
      data: {
        author: {
          role: 'appUser',
          appUserId: appUserId,
          client: getClientInfo(this.integrationId),
          sessionId: getSessionId(this.integrationId),
        },
        activity,
      },
    })
  }
}

export default ActivityApi
