import BaseApi from './BaseApi'
import storage from '../utils/storage'

class ConversationsApi extends BaseApi {
  list(appUserId) {
    return this.request({
      method: 'GET',
      path: `/sdk/v2/apps/${this.appId}/appusers/${appUserId}/conversations`,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`
      }
    })
  }

  create(appUserId) {
    return this.request({
      method: 'POST',
      path: `/sdk/v2/apps/${this.appId}/appusers/${appUserId}/conversations`,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`
      }
    })
  }
}

export default ConversationsApi
