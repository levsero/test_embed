import BaseApi from './BaseApi'

// TODO - This class should not be included in the client
// TODO - Just keeping it around to make it easier to compare against existing implementation

class IntegrationsApi extends BaseApi {
  constructor() {
    super(...arguments)
    this.baseUrl = this.baseUrl.slice(0, 8) + `${this.appId}.config.` + this.baseUrl.slice(8)
  }
}

Object.assign(IntegrationsApi.prototype, {
  config(integrationId = this.integrationId) {
    return this.request({
      method: 'GET',
      path: `/sdk/v2/integrations/${integrationId}/config`,
      headers: {
        'x-smooch-appid': ''
      }
    })
  }
})

export default IntegrationsApi
