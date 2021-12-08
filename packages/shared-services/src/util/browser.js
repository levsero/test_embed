import _ from 'lodash'
import { win } from 'src/util/globals'

// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
const onBrowserVisibilityEvent = (isBrowserTabVisible, callback) => {
  let hidden, visibilityChange
  if (typeof win.document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
  } else if (typeof win.document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
  } else if (typeof win.document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
  }

  function handleVisibilityChange() {
    if (isBrowserTabVisible === !win.document[hidden]) {
      callback()
    }
  }

  const isPageVisibilityAPISupported =
    typeof win.document.addEventListener !== 'undefined' && typeof hidden !== 'undefined'

  if (isPageVisibilityAPISupported) {
    win.document.addEventListener(visibilityChange, handleVisibilityChange, false)
  }
}

export const onBrowserTabVisible = (callback) => {
  onBrowserVisibilityEvent(true, callback)
}

export const onBrowserTabHidden = (callback) => {
  onBrowserVisibilityEvent(false, callback)
}

//https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
export const isBrowserOnline = () => Boolean(win.navigator.onLine)

export const onBrowserComingBackOnline = (callback) => {
  win.addEventListener('online', callback)
}

export const onBrowserGoingOffline = (callback) => {
  const debouncedCallback = _.debounce(callback, 5000)
  win.addEventListener('offline', debouncedCallback)
  win.addEventListener('online', debouncedCallback.cancel)
}
