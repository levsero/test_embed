import BaseApi from './BaseApi'

class AppUsersApi extends BaseApi {
  create(data = {}) {
    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/appusers`,
      data: {
        client: this.getClientInfo(),
        // userId: '', //  omit userId while all users are anonymous
        intent: 'conversation:start', //this will trigger a conversation:start webhook needed by AB
        ...data,
      },
      authorizationRequired: false,
    })
  }

  update(appUserId, data = {}) {
    return this.request({
      method: 'PUT',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}`,
      data,
    })
  }

  get(appUserId) {
    return this.request({
      method: 'GET',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}`,
    })
  }

  getLinkRequest(appUserId, integrationId) {
    return this.request({
      method: 'GET',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}/linkrequest?integrationIds=${integrationId}`,
    })
  }

  unlinkIntegration(appUserId, clientId) {
    return this.request({
      method: 'DELETE',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}/clients/${clientId}`,
    })
  }

  login(appUserId, externalId) {
    const { sessionToken } = this.user.getCurrentAppUserIfAny()
    const data = {
      client: this.getClientInfo(),
      userId: externalId,
      integrationId: this.integrationId,
      sessionToken,
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

  logout(appUserId) {
    const data = {
      client: this.getClientInfo(),
    }

    return this.request({
      method: 'POST',
      path: `/v2/apps/${this.appId}/appusers/${appUserId}/logout`,
      data,
    })
  }
}

export default AppUsersApi
