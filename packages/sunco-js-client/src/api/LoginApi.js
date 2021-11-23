import { getClientInfo } from '../utils/device'
import BaseApi from './BaseApi'

class LoginApi extends BaseApi {
  create(appUserId, externalId, jwt) {
    this.auth.jwt = jwt
    const data = {
      client: getClientInfo(this.integrationId),
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
