import _ from 'lodash'
import superagent from 'superagent'
import { settings } from 'src/service/settings'
import { getZendeskHost } from 'src/util/globals'
import {
  send,
  logFailure,
  buildFullUrl,
  getDynamicHostname,
  sendWithMeta,
  updateConfig,
  resetConfig,
  getConfig,
} from './http-base'

let config = {
  scheme: 'https',
  insecureScheme: 'http',
  zendeskHost: getZendeskHost(document),
  version: __EMBEDDABLE_VERSION__,
}

let cache = {}
const defaultConfig = {
  timeout: {
    response: 5000, // Wait 5 seconds for the response to start.
    deadline: 60000, // allow 1 minute for the response to finish.
  },
  retries: 1,
}
const clearCache = () => {
  cache = {}
}

function get(payload, options = {}) {
  const queryConfig = {
    ...defaultConfig,
    method: 'GET',
    ...options,
  }

  const url = buildFullUrl(payload)
  const cacheKey = `${queryConfig.method}-${url}${
    payload.query ? `-${JSON.stringify(payload.query)}` : ''
  }${payload.authorization ? `-${JSON.stringify(payload.authorization)}` : ''}`

  if (cache[cacheKey] && !options.skipCache) return cache[cacheKey]

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

  const requestPromise = (cache[cacheKey] = new Promise((resolve, reject) => {
    request
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
        logFailure(err, { ...queryConfig, ...payload })
      })
  }))

  requestPromise.catch(() => {
    delete cache[cacheKey]
  })

  return requestPromise
}

function getImage(payload) {
  const { done } = payload.callbacks
  const onEnd = (err, res) => {
    if (!err) {
      done(res)
    }
  }

  return superagent('get', payload.path)
    .responseType('blob')
    .set('Authorization', payload.authorization)
    .end(onEnd)
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
    .on('progress', function (e) {
      if (payload.callbacks) {
        if (_.isFunction(payload.callbacks.progress)) {
          payload.callbacks.progress(e)
        }
      }
    })
    .end(function (err, res) {
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

export const http = {
  getImage,
  send,
  sendWithMeta,
  sendFile,
  get,
  callMeRequest,
  updateConfig,
  getDynamicHostname,
  getConfig, //for testing purposes
  resetConfig, //for testing purposes
  clearCache, //for testing purposes
  logFailure, //for testing purposes
}
