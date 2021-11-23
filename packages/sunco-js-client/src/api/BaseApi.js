import Request from '../http/Request'
import { VENDOR_ID, VERSION } from '../utils/constants'
import { getOrCreateClientId } from '../utils/device'
import { buildUrl } from '../utils/path'
import storage from '../utils/storage'

class BaseApi {
  constructor(options) {
    this.baseUrl = options.baseUrl
    this.appId = options.appId
    this.integrationId = options.integrationId
    this.appUserId = options.appUserId
    this.auth = options.auth
  }

  request({
    method = 'GET',
    path = '',
    data = {},
    params = {},
    headers = {},
    authorizationRequired = true,
  }) {
    if (authorizationRequired) {
      if (this.auth.jwt) {
        headers.Authorization = `Bearer ${this.auth.jwt}`
      } else {
        headers.Authorization = `Basic ${btoa(
          `${this.appUserId}:${storage.getItem(`${this.integrationId}.sessionToken}`)}`
        )}`
      }
    }
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
