import BaseApi from './BaseApi'
import { getClientInfo } from '../utils/device'
import * as storage from '../utils/storage'

export class AppUsersApi extends BaseApi {}

Object.assign(AppUsersApi.prototype, {
  create(data = {}) {
    return this.request({
      method: 'POST',
      path: `/sdk/v2/apps/${this.appId}/appusers`,
      data: {
        client: getClientInfo(this.integrationId),
        userId: '', //must be an empty string for anonymous user
        intent: 'conversation:start', //this will trigger a conversation:start webhook needed by AB
        ...data
      }
    })
  },

  get(appUserId) {
    return this.request({
      method: 'GET',
      path: `/sdk/v2/apps/${this.appId}/appusers/${appUserId}`,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`
      }
    })
  }
})

export default AppUsersApi
