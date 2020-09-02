import BaseApi from './BaseApi'

// Please note - This endpoint is the equivalent of the /embeddable/config endpoint
// We won't need to use it for the new Messenger, but I'm including it for the moment
// because it's helpful for debugging setup issues and seeing which feature flags are
// enabled for your app/integration.
//
// client.SDKConfig.init().then(response => console.log(response))
//
// SunCo feature flags: client.SDKConfig.init().then(response => console.log(response.body.config.app.settings))
//

class SDKConfigApi extends BaseApi {
  init() {
    return this.request({
      method: 'GET',
      path: `/sdk/v2/integrations/${this.integrationId}/config`
    })
  }
}

export default SDKConfigApi
