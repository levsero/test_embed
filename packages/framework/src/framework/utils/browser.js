import _ from 'lodash'
import hostPageWindow from 'src/framework/utils/hostPageWindow'

// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
const onBrowserVisibilityEvent = (isBrowserTabVisible, callback) => {
  let hidden, visibilityChange
  if (typeof hostPageWindow.document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
  } else if (typeof hostPageWindow.document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
  } else if (typeof hostPageWindow.document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
  }

  function handleVisibilityChange() {
    if (isBrowserTabVisible === !hostPageWindow.document[hidden]) {
      callback()
    }
  }

  const isPageVisibilityAPISupported =
    typeof hostPageWindow.document.addEventListener !== 'undefined' && typeof hidden !== 'undefined'

  if (isPageVisibilityAPISupported) {
    hostPageWindow.document.addEventListener(visibilityChange, handleVisibilityChange, false)
  }
}

export const onBrowserTabVisible = (callback) => {
  onBrowserVisibilityEvent(true, callback)
}

export const onBrowserTabHidden = (callback) => {
  onBrowserVisibilityEvent(false, callback)
}

//https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
export const isBrowserOnline = () => Boolean(hostPageWindow.navigator.onLine)

export const onBrowserComingBackOnline = (callback) => {
  hostPageWindow.addEventListener('online', callback)
}

export const onBrowserGoingOffline = (callback) => {
  const debouncedCallback = _.debounce(callback, 5000)
  hostPageWindow.addEventListener('offline', debouncedCallback)
  hostPageWindow.addEventListener('online', debouncedCallback.cancel)
}
