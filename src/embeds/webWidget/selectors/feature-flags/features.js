// Note: This file is shared with the Widget Developer Dashboard
// Do not import from any other file

export default {
  web_widget_prechat_form_v2: {
    defaultValue: false,
    getArturoValue: state => state.base.embeddableConfig.embeds?.chat?.props?.webWidgetPrechatFormV2
  },
  use_production_sunco: {
    defaultValue: false
  },
  web_widget_new_boot_sequence: {
    defaultValue: false,
    getArturoValue: config => config?.newBootSequence
  }
}
