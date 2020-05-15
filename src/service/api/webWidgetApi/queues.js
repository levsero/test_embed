import _ from 'lodash'
import { setLocaleApi } from 'src/service/api/apis'
import { beacon } from 'service/beacon'
import { apiExecute, apiStructurePostRenderSetup, apiStructurePreRenderSetup } from './setupApi'
import { setupPublicApi } from './setupLegacyApi'
import { logAndTrackApiError } from 'src/service/api/errorHandlers'
import ZEApiError from 'errors/nonFatal/ZEApiError'
import LegacyZEApiError from 'errors/nonFatal/LegacyZEApiError'

const newAPIPostRenderQueue = []

const apiAddToPostRenderQueue = (...args) => {
  newAPIPostRenderQueue.push(args)
}

const legacyApiFunctionNameSignature = apiFunctionName => {
  return `zE.${apiFunctionName}()`
}

const apiFunctionNameSignature = apiFunctionArray => {
  return `zE('${apiFunctionArray[0]}', '${apiFunctionArray[1]}', ...)`
}

const logZEApiError = (apiFunctionNameSignature = null, e = {}) => {
  logAndTrackApiError(new ZEApiError(apiFunctionNameSignature, e))
}

const logLegacyZEApiError = (apiFunctionNameSignature = null, e = {}) => {
  logAndTrackApiError(new LegacyZEApiError(apiFunctionNameSignature, e))
}

export function apisExecutePostRenderQueue(win, legacyPostRenderQueue, reduxStore) {
  let legacyApiFunctionName
  let apiFunctionArray

  try {
    legacyPostRenderQueue.forEach(([legacyApiFunctionName, functionArguments]) => {
      win.zE[legacyApiFunctionName](...functionArguments)
    })
  } catch (e) {
    logLegacyZEApiError(legacyApiFunctionNameSignature(legacyApiFunctionName), e)
  }

  try {
    newAPIPostRenderQueue.forEach(item => {
      apiFunctionArray = item
      apiExecute(apiStructurePostRenderSetup(), reduxStore, ...item)
    })
  } catch (e) {
    logZEApiError(apiFunctionNameSignature(apiFunctionArray[0]), e)
  }

  if (Math.random() <= 0.1) {
    beacon.sendWidgetInitInterval()
  }
}

export function setupLegacyApiQueue(win, legacyPostRenderQueue, reduxStore) {
  const postRenderCallback = (...args) => {
    try {
      if (typeof args[0] === 'function') {
        args[0]()
      } else {
        return apiExecute(apiStructurePostRenderSetup(), reduxStore, args)
      }
    } catch (e) {
      logLegacyZEApiError(null, e)
    }
  }
  // no "fat arrow" because it binds `this` to the scoped environment and does not allow it to be re-set with .bind()
  const postRenderQueueCallback = function(...args) {
    // "this" is bound to the method name
    legacyPostRenderQueue.push([this, args])
  }
  const publicApi = setupPublicApi(postRenderQueueCallback, reduxStore)
  const pairs = _.toPairs(win.zEmbed)

  if (win.zE === win.zEmbed) {
    win.zE = win.zEmbed = postRenderCallback
  } else {
    win.zEmbed = postRenderCallback
  }

  pairs.forEach(([key, value]) => {
    if (win.zE) win.zE[key] = value
    if (win.zEmbed) win.zEmbed[key] = value
  })

  return {
    publicApi
  }
}

export function apisExecuteQueue(reduxStore, queue) {
  _.forEach(queue, method => {
    if (method[0].locale) {
      // Backwards compat with zE({locale: 'zh-CN'}) calls
      setLocaleApi(reduxStore, method[0].locale)
    } else if (_.isFunction(method[0])) {
      // Old API
      try {
        method[0]()
      } catch (e) {
        logLegacyZEApiError(null, e)
      }
    } else if (_.includes(method[0], 'webWidget')) {
      // New API
      try {
        apiExecute(apiStructurePreRenderSetup(apiAddToPostRenderQueue), reduxStore, method)
      } catch (e) {
        logZEApiError(apiFunctionNameSignature(method), e)
      }
    } else {
      logZEApiError(method[0])
    }
  })
}
