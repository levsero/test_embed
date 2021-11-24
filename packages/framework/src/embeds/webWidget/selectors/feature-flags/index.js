import { logger } from '@zendesk/widget-shared-services/logger'
import { store as persistenceStore } from '@zendesk/widget-shared-services/persistence'
import inDebugMode from '@zendesk/widget-shared-services/util/in-debug-mode'
import features, { updateFeatures } from './features'

const featurePrefix = 'feature-'
const getFullStorageName = (name) => `${persistenceStore.prefix}${featurePrefix}${name}`

const hasWarnedAboutFeature = {}

const logFeatureOverrideUsage = (name, enabled) => {
  if (hasWarnedAboutFeature[name] === enabled) {
    return
  }
  hasWarnedAboutFeature[name] = enabled

  const message = [
    `Feature flag "${name}" is currently overridden to be "${enabled}"`,
    'To stop overriding this feature enter the following into the browser console',
    `\n\tdelete localStorage["${getFullStorageName(name)}"]`,
  ].join('\n')

  logger.devLog(message)
}

const isFeatureEnabled = (stateOrConfig, name) => {
  const feature = features[name]

  if (!feature) {
    return false
  }

  if (inDebugMode()) {
    const value = localStorage.getItem(getFullStorageName(name))

    if (value === 'true') {
      logFeatureOverrideUsage(name, value)
      return true
    }

    if (value === 'false') {
      logFeatureOverrideUsage(name, value)
      return false
    }

    if (hasWarnedAboutFeature[name]) {
      logger.devLog(`You are no longer overriding feature "${name}"`)
      delete hasWarnedAboutFeature[name]
    }
  }

  if (!feature.getArturoValue) {
    return feature.defaultValue
  }

  return Boolean(feature.getArturoValue(stateOrConfig))
}

export { updateFeatures }

export default isFeatureEnabled
