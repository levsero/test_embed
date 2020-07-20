// Note: This file is shared with the Widget Developer Dashboard
// Do not import from any other file

export default {
  chat_embed_prechat_form_enabled: {
    defaultValue: false
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
