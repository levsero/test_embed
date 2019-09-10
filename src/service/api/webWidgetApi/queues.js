import _ from 'lodash'
import { setLocaleApi } from 'src/service/api/apis'
import { renderer } from 'service/renderer'
import { apiExecute, apiStructurePostRenderSetup, apiStructurePreRenderSetup } from './setupApi'
import { setupPublicApi, setupDevApi } from './setupLegacyApi'
import ZDApiError from 'errors/console/ZDApiError'
import ApiExecuteError from 'errors/nonFatal/ApiExecuteError'
import errorTracker from 'service/errorTracker'

const newAPIPostRenderQueue = []

const apiAddToPostRenderQueue = (...args) => {
  newAPIPostRenderQueue.push(args)
}

export function apisExecutePostRenderQueue(win, postRenderQueue, reduxStore) {
  try {
    postRenderQueue.forEach(method => {
      win.zE[method[0]](...method[1])
    })

    newAPIPostRenderQueue.forEach(item => {
      apiExecute(apiStructurePostRenderSetup(), reduxStore, ...item)
    })

    renderer.postRenderCallbacks()
  } catch (e) {
    errorTracker.error(new ApiExecuteError('Api execution error found with new api'), {
      actualErrorMessage: e.message
    })
  }
}

export function setupLegacyApiQueue(win, postRenderQueue, reduxStore) {
  let devApi

  const postRenderCallback = (...args) => {
    try {
      if (typeof args[0] === 'function') {
        args[0]()
      } else {
        return apiExecute(apiStructurePostRenderSetup(), reduxStore, args)
      }
    } catch (e) {
      errorTracker.error(new ApiExecuteError('Api execution error found with legacy api'), {
        actualErrorMessage: e.message
      })
    }
  }
  // no "fat arrow" because it binds `this` to the scoped environment and does not allow it to be re-set with .bind()
  const postRenderQueueCallback = function(...args) {
    // "this" is bound to the method name
    postRenderQueue.push([this, args])
  }
  const publicApi = setupPublicApi(postRenderQueueCallback, reduxStore)
  const pairs = _.toPairs(win.zEmbed)

  if (__DEV__) {
    devApi = setupDevApi(win, reduxStore)
  }
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
    publicApi,
    devApi
  }
}

export function apisExecuteQueue(reduxStore, queue) {
  const logApiError = (api, e = {}) => {
    throw new ZDApiError(
      [
        'An error occurred in your use of the Zendesk Widget API:',
        api,
        "Check out the Developer API docs to make sure you're using it correctly",
        'https://developer.zendesk.com/embeddables/docs/widget/api',
        e.stack
      ].join('\n\n')
    )
  }

  _.forEach(queue, method => {
    if (method[0].locale) {
      // Backwards compat with zE({locale: 'zh-CN'}) calls
      setLocaleApi(method[0].locale)
    } else if (_.isFunction(method[0])) {
      // Old API
      try {
        method[0]()
      } catch (e) {
        logApiError(method[0], e)
      }
    } else if (_.includes(method[0], 'webWidget')) {
      // New API
      try {
        apiExecute(apiStructurePreRenderSetup(apiAddToPostRenderQueue), reduxStore, method)
      } catch (e) {
        logApiError(`"${method[0]} ${method[1]}"`, e)
      }
    } else {
      logApiError(method)
    }
  })
}
