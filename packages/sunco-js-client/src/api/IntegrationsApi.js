import BaseApi from './BaseApi'

// Temporary API until we can get this data via embeddable config
class IntegrationsApi extends BaseApi {
  get() {
    return this.request({
      method: 'GET',
      path: `/v2/integrations/${this.integrationId}/config`,
    })
  }
}

export default IntegrationsApi
