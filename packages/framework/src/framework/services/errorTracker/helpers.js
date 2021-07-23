import { store } from 'src/framework/services/persistence'
import { getZendeskHost } from 'src/util/globals'

const inDebugMode = () => __DEV__ || store.get('debug') || false

const getHostUrl = () => {
  const win = window.parent
  const location = win.location
  return location.toString()
}

const getSubdomain = () => {
  return getZendeskHost(document)
}

export { inDebugMode, getHostUrl, getSubdomain }
