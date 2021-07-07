// Note: This file is shared with the Widget Developer Dashboard
// Do not import from any other file
// localStorage.setItem(`ZD-feature-web_widget_prefetch_widget_container`, true)

export default {
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
  log_all_messenger_errors: {
    defaultValue: false,
    getArturoValue: (config) => config?.logMessengerErrors,
  },
  web_widget_channel_linking: {
    defaultValue: false,
    getArturoValue: (config) => config?.channelLinking,
  },
  web_widget_prefetch_widget_container: {
    defaultValue: false,
    getArturoValue: (state) => state?.base?.embeddableConfig?.prefetchWidgetContainer,
  },
}
