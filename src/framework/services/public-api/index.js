import _ from 'lodash'
import { logAndTrackApiError } from 'service/api/errorHandlers'
import ZEApiError from 'errors/nonFatal/ZEApiError'
import LegacyZEApiError from 'errors/nonFatal/LegacyZEApiError'
import tracker from 'service/tracker'

const baseProperties = {
  version: __EMBEDDABLE_VERSION__
}
let api = {}

function zE(...params) {
  const [root, name, ...args] = params

  if (typeof root === 'function') {
    try {
      root()
    } catch (err) {
      logAndTrackApiError(new LegacyZEApiError(null, err))
    }
    return
  }

  if (typeof api[root]?.[name] !== 'function') {
    throw new Error(`Method ${root}.${name} does not exist`)
  }

  try {
    const result = api[root][name](...args)

    tracker.track(`${root}.${name}`, ...args)

    return result
  } catch (err) {
    logAndTrackApiError(new ZEApiError(`zE('${root}', '${name}', ...)`, err))
  }
}

const registerApi = newApis => {
  api = _.merge(api, newApis)
}

const registerLegacyApi = newApis => {
  Object.entries(newApis).forEach(([name, apiFunction]) => {
    if (typeof apiFunction === 'function') {
      zE[name] = (...args) => {
        try {
          apiFunction(...args)
        } catch (err) {
          logAndTrackApiError(new LegacyZEApiError(`zE.${name}()`, err))
        }
      }
    } else {
      zE[name] = apiFunction
    }
  })
}

const run = () => {
  Object.keys(baseProperties).forEach(key => {
    zE[key] = baseProperties[key]
  })

  const originalFunction = window.parent.zE || window.parent.zEmbed

  if (window.parent.zE === window.parent.zEmbed) {
    window.parent.zE = zE
  }
  window.parent.zEmbed = zE

  Object.keys(originalFunction ?? {}).forEach(key => {
    zE[key] = originalFunction[key]
  })

  tracker.addTo(window.parent.zE, 'zE')

  document.zEQueue?.forEach?.(call => {
    zE(...call)
  })
  delete document.zEQueue
}

export default { run, registerApi, registerLegacyApi }
