import { buildUrl } from '../utils/path'
import { getClientId } from '../utils/device'
import { VENDOR_ID, VERSION } from '../utils/constants'
import Request from '../http/Request'

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
      'x-smooch-clientid': getClientId(this.integrationId),
      ...headers
    }

    const url = buildUrl(this.baseUrl, path)
    const _request = new Request({ method, url, data, params, headers: suncoApiHeaders })

    return _request.response()
  }
}

export default BaseApi
