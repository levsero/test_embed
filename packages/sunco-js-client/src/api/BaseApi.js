import Request from '../http/Request'
import { VENDOR_ID, VERSION } from '../utils/constants'
import { buildUrl } from '../utils/path'

class BaseApi {
  constructor(options) {
    this.baseUrl = options.baseUrl
    this.appId = options.appId
    this.integrationId = options.integrationId
    this.user = options.user
  }

  async request({
    method = 'GET',
    path = '',
    data = {},
    params = {},
    headers = {},
    authorizationRequired = true,
  }) {
    const { jwt: maybeJwt, getJWT } = this.user.getCurrentAppUserIfAny()

    if (!maybeJwt && getJWT) {
      await this.user.generateJWT()
    }

    const { jwt, sessionToken, appUserId, clientId } = this.user.getCurrentAppUserIfAny()

    if (authorizationRequired) {
      if (jwt) {
        headers.Authorization = `Bearer ${jwt}`
      } else {
        headers.Authorization = `Basic ${btoa(`${appUserId}:${sessionToken}`)}`
      }
    }
    const suncoApiHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-smooch-sdk': `web/${VENDOR_ID}/${VERSION}`,
      'x-smooch-appid': this.appId,
      'x-smooch-clientid': clientId,
      ...headers,
    }

    const url = buildUrl(this.baseUrl, path)
    const _request = new Request({ method, url, data, params, headers: suncoApiHeaders })

    return _request.response()
  }

  getClientInfo() {
    const { document: _document, navigator } = parent
    const href = _document.location && _document.location.href
    const host = _document.location && _document.location.host

    const { clientId } = this.user.getCurrentAppUserIfAny()

    return {
      platform: 'web', //required
      id: clientId, //required
      integrationId: this.integrationId, //required
      info: {
        vendor: `${VENDOR_ID}`,
        sdkVersion: `${VERSION}`,
        URL: host,
        userAgent: navigator.userAgent,
        referrer: _document.referrer,
        browserLanguage: navigator.language,
        currentUrl: href,
        currentTitle: _document.title,
      },
    }
  }
}

export default BaseApi
