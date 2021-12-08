import BaseApi from './BaseApi'

class ConversationsApi extends BaseApi {
  list(appUserId) {
    return this.request({
      method: 'GET',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}/conversations`,
    })
  }

  create(appUserId) {
    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}/conversations`,
    })
  }
}

export default ConversationsApi
