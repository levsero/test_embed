import _ from 'lodash'
import { logAndTrackApiError } from 'service/api/errorHandlers'
import tracker from 'service/tracker'
import ZEApiError from './ZEApiError'
import LegacyZEApiError from './LegacyZEApiError'

const baseProperties = {
  version: __EMBEDDABLE_VERSION__
}
let api = {}
let isMessengerWidgetUsed = false
let errorDisplayed = false
const displayError = (isMessengerWidgetUsed, errorMessage) => {
  const messengerConsoleMessage = `\n
  A note from Zendesk: API methods associated with the Web Widget (Classic) 
  are still being executed on this page. This website is now using the new 
  Web SDK (messaging experience) which no longer supports these APIs. If you 
  don't intend to use the Web Widget (Classic), we recommend that you remove 
  this code from your website.  Whilst not recommended, leaving them won't 
  cause any issues. \n`

  if (isMessengerWidgetUsed) {
    if (errorDisplayed) return ''
    errorDisplayed = true
    return errorMessage + messengerConsoleMessage
  } else {
    return errorMessage
  }
}

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

  // Support a legacy, undocumented way of setting locale
  // zE({ locale: 'en-US' })
  if (root && root.locale) {
    zE('webWidget', 'setLocale', root.locale)
    tracker.track(`legacy-webWidget.setLocale`, root.locale)
    return
  }

  if (typeof api[root]?.[name] !== 'function') {
    if (isMessengerWidgetUsed && errorDisplayed) return
    const err = displayError(isMessengerWidgetUsed, `Method ${root}.${name} does not exist`)
    throw new Error(err)
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

const run = ({ isMessengerWidget }) => {
  isMessengerWidgetUsed = isMessengerWidget

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
    try {
      zE(...call)
    } catch (err) {
      // eslint-disable-next-line no-console
      isMessengerWidgetUsed ? console.warn(err) : console.error(err)
    }
  })
}

export default { run, registerApi, registerLegacyApi }