import { store } from 'service/persistence'

const inDebugMode = () => __DEV__ || store.get('debug') || false

const getHostUrl = () => {
  const win = window.parent
  const location = win.location
  return location.toString()
}

export { inDebugMode, getHostUrl }