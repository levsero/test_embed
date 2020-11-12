const hostPageWindow = window.top

export const onBrowserTabFocus = callback => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

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
    const isTabCurrentlyVisible = !hostPageWindow.document[hidden]
    if (isTabCurrentlyVisible) {
      callback()
    }
  }

  const isPageVisibilityAPISupported =
    typeof hostPageWindow.document.addEventListener !== 'undefined' && typeof hidden !== 'undefined'

  if (isPageVisibilityAPISupported) {
    hostPageWindow.document.addEventListener(visibilityChange, handleVisibilityChange, false)
  }
}

//https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
export const isBrowserOnline = () => Boolean(hostPageWindow.navigator.onLine)

export const onBrowserComingBackOnline = callback => {
  hostPageWindow.addEventListener('online', callback)
}

export const onBrowserGoingOffline = callback => {
  hostPageWindow.addEventListener('offline', callback)
}
