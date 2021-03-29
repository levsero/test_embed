import BaseApi from './BaseApi'
import { getClientInfo } from '../utils/device'
import storage from '../utils/storage'

class AppUsersApi extends BaseApi {
  create(data = {}) {
    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/appusers`,
      data: {
        client: getClientInfo(this.integrationId),
        // userId: '', //  omit userId while all users are anonymous
        intent: 'conversation:start', //this will trigger a conversation:start webhook needed by AB
        ...data,
      },
    })
  }

  update(appUserId, data = {}) {
    return this.request({
      method: 'PUT',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}`,
      data: {
        ...data,
      },
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`,
      },
    })
  }

  get(appUserId) {
    return this.request({
      method: 'GET',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}`,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`,
      },
    })
  }

  getLinkRequest(appUserId, integrationId) {
    return this.request({
      method: 'GET',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}/linkrequest?integrationIds=${integrationId}`,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`,
      },
    })
  }

  unlinkChannel(appUserId, clientId) {
    return this.request({
      method: 'DELETE',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}/clients/${clientId}`,
      headers: {
        Authorization: `Basic ${btoa(
          `${appUserId}:${storage.getItem(`${this.integrationId}.sessionToken`)}`
        )}`,
      },
    })
  }
}

export default AppUsersApi
