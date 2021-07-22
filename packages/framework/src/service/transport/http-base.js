import _ from 'lodash'
import superagent from 'superagent'
import HttpApiError from 'src/errors/nonFatal/HttpApiError'
import errorTracker from 'src/framework/services/errorTracker'
import { identity } from 'src/service/identity'
import { getReferrerPolicy, getZendeskHost, location, win } from 'utility/globals'
import { base64encode, referrerPolicyUrl } from 'utility/utils'

let config = {
  scheme: 'https',
  insecureScheme: 'http',
  zendeskHost: getZendeskHost(document),
  version: __EMBEDDABLE_VERSION__,
}

let hasLeftPage = false
try {
  window.addEventListener('beforeunload', () => {
    hasLeftPage = true
  })
} catch {}

function getDynamicHostname(useHostMappingIfAvailable) {
  return useHostMappingIfAvailable && config.hostMapping ? config.hostMapping : config.zendeskHost
}

function buildFullUrl(payload) {
  const scheme = payload.forceHttp ? config.insecureScheme : config.scheme
  const host = payload.forceHttp
    ? location.hostname
    : getDynamicHostname(payload.useHostMappingIfAvailable)

  if (payload.path.includes(scheme + '://' + host)) return payload.path
  return scheme + '://' + host + payload.path
}

function logFailure(error, payload) {
  if (shouldExclude(error, payload)) return

  const apiError = new HttpApiError(error)
  const errorTitle = `${apiError.name}: ${apiError.message}`
  const errorData = {
    method: payload.method.toUpperCase(),
    path: payload.path,
    actualErrorMessage: apiError.message,
    status: apiError.data.status,
    hostname: location.hostname,
  }

  if (!apiError.data.status) {
    if (hasLeftPage || win.navigator?.onLine === false) {
      return
    }
  }

  errorTracker.error(errorTitle, errorData)
}

function shouldExclude(error, payload = {}) {
  return error.status == 404 || /embeddable_(blip|identify)/.test(payload.path)
}

function send(payload, addType = true) {
  if (!config.zendeskHost) {
    throw 'Missing zendeskHost config param.'
  }

  const request = superagent(payload.method.toUpperCase(), buildFullUrl(payload))
    .timeout(payload.timeout || 60000)
    .set('Authorization', payload.authorization)

  if (addType) request.type('json')

  if (payload.method.toUpperCase() === 'POST') {
    request.send(payload.params || {})
  }

  if (!_.isEmpty(payload.query)) request.query(payload.query)

  // in dev, skip the CDN cache by always appending a query string to bust the cache
  if (__DEV__ && payload.method.toUpperCase() === 'GET') {
    request.query({ _: Date.now() })
  }

  if (payload.locale) request.set('Accept-Language', payload.locale)

  request.end((err, res) => {
    if (payload.callbacks) {
      if (err) {
        if (_.isFunction(payload.callbacks.fail)) {
          payload.callbacks.fail(err)
        }
      } else {
        if (_.isFunction(payload.callbacks.done)) {
          payload.callbacks.done(res)
        }
      }
      if (_.isFunction(payload.callbacks.always)) {
        payload.callbacks.always()
      }
    }

    if (err) {
      logFailure(err, payload)
    }
  })
}

function sendWithMeta(payload) {
  const commonParams = {
    buid: identity.getBuid(),
    suid: identity.getSuid().id,
    version: config.version,
    timestamp: new Date().toISOString(),
  }

  const { name, email, phone } = identity.getUserIdentity()
  let identityParams = {}

  if (name || email || phone) {
    let innerIdentity = {}

    if (name) innerIdentity.name = name
    if (email) innerIdentity.email = email
    if (phone) innerIdentity.phone = phone

    identityParams = { identity: innerIdentity }
  }

  const url = getReferrerPolicy()
    ? referrerPolicyUrl(getReferrerPolicy(), location.href)
    : location.href
  const urlParams = url ? { url } : {}

  _.extend(payload.params, commonParams, identityParams, urlParams)

  payload.query = {
    type: payload.type,
    data: base64encode(JSON.stringify(payload.params)),
  }
  const base64Payload = _.pick(payload, ['method', 'path', 'query', 'callbacks'])

  send(base64Payload, false)
}

function updateConfig(updates) {
  config = _.extend(config, updates)
}

function resetConfig() {
  config = {
    scheme: 'https',
    insecureScheme: 'http',
    zendeskHost: getZendeskHost(document),
    version: __EMBEDDABLE_VERSION__,
  }
}

function getConfig() {
  return config
}

export {
  getDynamicHostname,
  buildFullUrl,
  logFailure,
  send,
  sendWithMeta,
  updateConfig,
  resetConfig,
  getConfig,
}
