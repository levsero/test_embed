// Note: This file is shared with the Widget Developer Dashboard
// Do not import from any other file
// localStorage.setItem(`ZD-feature-web_widget_prefetch_widget_container`, true)

let features = {}

export const updateFeatures = (updatedFeatures) => {
  features = updatedFeatures
}

const featureConfig = {
  web_widget_prechat_form_visible_departments: {
    defaultValue: false,
    getArturoValue: (state) =>
      state.base?.embeddableConfig?.embeds?.chat?.props?.webWidgetPrechatFormVisibleDepartments,
  },
  use_production_sunco: {
    defaultValue: false,
  },
  digital_voice_enabled: {
    defaultValue: false,
  },
  web_widget_messenger_animations_disabled: {
    defaultValue: false,
  },
  web_widget_messenger_file_uploads: {
    defaultValue: false,
    getArturoValue: () => features.messengerFileUploads,
  },
  log_all_messenger_errors: {
    defaultValue: false,
    getArturoValue: () => features.logMessengerErrors,
  },
  web_widget_prefetch_widget_container: {
    defaultValue: false,
    getArturoValue: (state) => state?.base?.embeddableConfig?.prefetchWidgetContainer,
  },
  chat_flush_queue_order: {
    defaultValue: false,
    getArturoValue: () => features.chat_flush_queue_order,
  },
  web_widget_set_department_queue: {
    defaultValue: false,
    getArturoValue: () => features.setDepartmentQueue,
  },
  web_widget_jwt_auth: {
    defaultValue: false,
    getArturoValue: () => features.jwtAuth,
  },
  module_federation: {
    defaultValue: false,
    getArturoValue: () => features.moduleFederation,
  },
  ...(__DEV__ && {
    dev_override_sunco: {
      defaultValue: false,
      getArturoValue: () => false,
      thing: 'this is a test string',
    },
  }),
}

export default featureConfig
