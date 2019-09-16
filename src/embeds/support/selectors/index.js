import { createSelector } from 'reselect'
export const getSupportConfig = state => state.support.config

export const getNewSupportEmbedEnabled = createSelector(
  [getSupportConfig],
  config => {
    return config.webWidgetReactRouterSupport
  }
)

export const getMaxFileCount = createSelector(
  [getSupportConfig],
  config => config.maxFileCount
)

export const getMaxFileSize = createSelector(
  [getSupportConfig],
  config => config.maxFileSize
)
