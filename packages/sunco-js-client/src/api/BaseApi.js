import Request from '../http/Request'
import { VENDOR_ID, VERSION } from '../utils/constants'
import { getOrCreateClientId } from '../utils/device'
import { buildUrl } from '../utils/path'

class BaseApi {
  constructor(options) {
    this.baseUrl = options.baseUrl
    this.appId = options.appId
    this.integrationId = options.integrationId
    this.appUserId = options.appUserId
  }

  request({ method = 'GET', path = '', data = {}, params = {}, headers = {} }) {
    const suncoApiHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-smooch-sdk': `web/${VENDOR_ID}/${VERSION}`,
      'x-smooch-appid': this.appId,
      'x-smooch-clientid': getOrCreateClientId(this.integrationId),
      ...headers,
    }

    const url = buildUrl(this.baseUrl, path)
    const _request = new Request({ method, url, data, params, headers: suncoApiHeaders })

    return _request.response()
  }
}

export default BaseApi
