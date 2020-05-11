import _ from 'lodash'
import superagent from 'superagent'

import { identity } from 'service/identity'
import { settings } from 'service/settings'
import { location, getReferrerPolicy, getZendeskHost } from 'utility/globals'
import { base64encode, referrerPolicyUrl } from 'utility/utils'
import errorTracker from 'service/errorTracker'
import HttpApiError from 'errors/nonFatal/HttpApiError'

let config = {
  scheme: 'https',
  insecureScheme: 'http',
  zendeskHost: getZendeskHost(document),
  version: __EMBEDDABLE_VERSION__
}

function updateConfig(updates) {
  config = _.extend(config, updates)
}

function resetConfig() {
  config = {
    scheme: 'https',
    insecureScheme: 'http',
    zendeskHost: getZendeskHost(document),
    version: __EMBEDDABLE_VERSION__
  }
}

function getConfig() {
  return config
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

let cache = {}
const defaultConfig = {
  timeout: {
    response: 5000, // Wait 5 seconds for the response to start.
    deadline: 60000 // allow 1 minute for the response to finish.
  },
  retries: 1
}
const clearCache = () => {
  cache = {}
}

function getWithCache(payload, options) {
  const queryConfig = {
    ...defaultConfig,
    method: 'GET',
    ...options
  }

  const url = buildFullUrl(payload)
  const cacheKey = `${queryConfig.method}-${url}${
    payload.query ? `-${JSON.stringify(payload.query)}` : ''
  }${payload.authorization ? `-${JSON.stringify(payload.authorization)}` : ''}`

  if (cache[cacheKey]) return cache[cacheKey]

  const request = superagent(queryConfig.method, url)
    .timeout(queryConfig.timeout)
    .set('Authorization', payload.authorization)
    .retry(queryConfig.retries)

  if (payload.responseType) request.responseType(payload.responseType)
  if (!_.isEmpty(payload.query)) request.query(payload.query)
  if (payload.locale) request.set('Accept-Language', payload.locale)

  // in dev, skip the CDN cache by always appending a query string to bust the cache
  if (__DEV__ && queryConfig.method === 'GET') {
    request.query({ _: Date.now() })
  }

  const requestPromise = new Promise((resolve, reject) => {
    request
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
        logFailure(err, { ...queryConfig, ...payload })
      })
  })

  requestPromise.then(() => {
    cache[cacheKey] = requestPromise
  })
  return requestPromise
}

function sendWithMeta(payload) {
  const commonParams = {
    buid: identity.getBuid(),
    suid: identity.getSuid().id,
    version: config.version,
    timestamp: new Date().toISOString()
  }

  const { name, email } = identity.getUserIdentity()
  let identityParams = {}

  if (name || email) {
    let innerIdentity = {}

    if (name) innerIdentity.name = name
    if (email) innerIdentity.email = email

    identityParams = { identity: innerIdentity }
  }

  const url = getReferrerPolicy()
    ? referrerPolicyUrl(getReferrerPolicy(), location.href)
    : location.href
  const urlParams = url ? { url } : {}

  _.extend(payload.params, commonParams, identityParams, urlParams)

  payload.query = {
    type: payload.type,
    data: base64encode(JSON.stringify(payload.params))
  }
  const base64Payload = _.pick(payload, ['method', 'path', 'query', 'callbacks'])

  send(base64Payload, false)
}

function sendFile(payload) {
  if (!config.zendeskHost) {
    throw 'Missing zendeskHost config param.'
  }

  /* eslint camelcase:0 */
  return superagent(payload.method.toUpperCase(), buildFullUrl(payload))
    .query({ filename: payload.file.name })
    .query({ via_id: settings.get('viaId') })
    .attach('uploaded_data', payload.file)
    .on('progress', function(e) {
      if (payload.callbacks) {
        if (_.isFunction(payload.callbacks.progress)) {
          payload.callbacks.progress(e)
        }
      }
    })
    .end(function(err, res) {
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
      }

      if (err) {
        logFailure(err, payload)
      }
    })
}

function buildFullUrl(payload) {
  const scheme = payload.forceHttp ? config.insecureScheme : config.scheme
  const host = payload.forceHttp
    ? location.hostname
    : getDynamicHostname(payload.useHostMappingIfAvailable)

  if (payload.path.includes(scheme + '://' + host)) return payload.path
  return scheme + '://' + host + payload.path
}

function getDynamicHostname(useHostMappingIfAvailable) {
  return useHostMappingIfAvailable && config.hostMapping ? config.hostMapping : config.zendeskHost
}

function callMeRequest(talkServiceUrl, payload) {
  const path = 'talk_embeddables_service/callback_request'
  const method = 'POST'

  superagent(method, `${talkServiceUrl}/${path}`)
    .send(payload.params)
    .end((err, res) => {
      const { done, fail } = payload.callbacks

      if (err) {
        if (_.isFunction(fail)) {
          fail(err, res)
        }
        logFailure(err, { path, method, ...payload })
      } else if (_.isFunction(done)) {
        done(res)
      }
    })
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
    hostname: location.hostname
  }
  errorTracker.error(errorTitle, errorData)
}

function shouldExclude(error, payload = {}) {
  return error.status == 404 || /embeddable_(blip|identify)/.test(payload.path)
}

export const http = {
  send,
  sendWithMeta,
  sendFile,
  getWithCache,
  get: send,
  callMeRequest,
  updateConfig,
  getDynamicHostname,
  getConfig, //for testing purposes
  resetConfig, //for testing purposes
  clearCache, //for testing purposes
  logFailure //for testing purposes
}
