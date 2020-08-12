// Note: This file is shared with the Widget Developer Dashboard
// Do not import from any other file

export default {
  web_widget_prechat_form_v2: {
    defaultValue: false,
    getArturoValue: state => state.base.embeddableConfig.embeds?.chat?.props?.webWidgetPrechatFormV2
  },
  defer_talk_connection: {
    defaultValue: false,
    getArturoValue: state => state.base.embeddableConfig.deferTalkConnection
  },
  messenger_widget: {
    defaultValue: false
  },
  web_widget_new_boot_sequence: {
    defaultValue: false
  }
}
