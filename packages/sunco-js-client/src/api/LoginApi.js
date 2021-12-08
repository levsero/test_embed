import BaseApi from './BaseApi'

class LoginApi extends BaseApi {
  create(appUserId, externalId) {
    const data = {
      client: this.getClientInfo(),
      userId: externalId,
    }

    if (appUserId) {
      data.appUserId = appUserId
    }

    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/login`,
      data,
    })
  }
}

export default LoginApi
