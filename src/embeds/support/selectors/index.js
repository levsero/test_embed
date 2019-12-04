export const getSupportConfig = state => state.support.config

export const getNewSupportEmbedEnabled = state =>
  getSupportConfig(state).webWidgetReactRouterSupport

export const getMaxFileCount = state => getSupportConfig(state).maxFileCount

export const getMaxFileSize = state => getSupportConfig(state).maxFileSize

export const getActiveFormName = state => state.support.activeFormName

export const getFormState = (state, name) => state.support.formStates[name]
