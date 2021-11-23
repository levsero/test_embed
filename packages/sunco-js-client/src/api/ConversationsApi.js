import BaseApi from './BaseApi'

class ConversationsApi extends BaseApi {
  list(appUserId) {
    return this.request({
      method: 'GET',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}/conversations`,
    })
  }

  create(appUserId) {
    const data = {
      client: this.getClientInfo(),
      type: 'personal',
    }
    return this.request({
      method: 'POST',
      data,
      path: `/v2/apps/${this.appId}/appusers/${appUserId}/conversations`,
    })
  }
}

export default ConversationsApi
