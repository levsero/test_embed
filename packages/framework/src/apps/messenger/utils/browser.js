import hostPageWindow from 'src/framework/utils/hostPageWindow'

//https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
export const isBrowserOnline = () => Boolean(hostPageWindow.navigator.onLine)

export const onBrowserComingBackOnline = callback => {
  hostPageWindow.addEventListener('online', callback)
}

export const onBrowserGoingOffline = callback => {
  hostPageWindow.addEventListener('offline', callback)
}
