// If this changes it also needs to change in styles vars
export const FONT_SIZE = 14

export const MAX_WIDGET_HEIGHT = 550
export const MAX_WIDGET_HEIGHT_NO_SEARCH = 140
export const MAX_WIDGET_HEIGHT_NO_SEARCH_NO_ZENDESK_LOGO = 125
export const MIN_WIDGET_HEIGHT = 150
export const WIDGET_MARGIN = 15
export const WIDGET_WIDTH = 342

// TODO: this is an incomplete list, and should probably include exports for all the other icons we use as well
export const ICONS = {
  AGENT_AVATAR: 'Icon--agent-avatar',
  ELLIPSIS: 'Icon--ellipsis',
  END_CHAT: 'Icon--endChat',
  ERROR_FILL: 'Icon--error-fill',
  PAPERCLIP_SMALL: 'Icon--paperclip-small',
  PAPERCLIP_LARGE: 'Icon--paperclip-large',
  PREVIEW_DEFAULT: 'Icon--preview-default',
  PREVIEW_DOCUMENT: 'Icon--preview-document',
  PREVIEW_IMAGE: 'Icon--preview-image',
  PREVIEW_PDF: 'Icon--preview-pdf',
  PREVIEW_PRESENTATION: 'Icon--preview-presentation',
  PREVIEW_SPREADSHEET: 'Icon--preview-spreadsheet',
  PREVIEW_ZIP: 'Icon--preview-zip',
  SEND_CHAT: 'Icon--sendChat',
  MENU: 'Icon--menu',
  DASH: 'Icon--dash',
  BACK: 'Icon--back',
  POPOUT: 'Icon--popout',
  CLOCK: 'Icon--clock-stroke',
  ZENDESK: 'Icon--zendesk',
  SOUND_OFF: 'Icon--sound-off',
  SOUND_ON: 'Icon--sound-on',
  SEARCH: 'Icon--search',
  CLEAR_INPUT: 'Icon--clearInput',
  THUMB_UP: 'Icon--thumbUp',
  THUMB_DOWN: 'Icon--thumbDown',
  AVATAR: 'Icon--avatar',
  LINK_EXTERNAL: 'Icon--link-external',
  CC_SUPPORT: 'Icon--channelChoice-contactForm',
  CC_CHAT: 'Icon--channelChoice-chat',
  CC_TALK: 'Icon--channelChoice-talk',
  CC_CLICK_TO_CALL: 'Icon--channelChoice-clickToCall',
  CHAT: 'Icon--chat',
  ARTICLE: 'Icon--article',
  FACEBOOK: 'Icon--facebook',
  GOOGLE: 'Icon--google'
}

export const FILETYPE_ICONS = {
  PDF: ICONS.PREVIEW_PDF,
  PPT: ICONS.PREVIEW_PRESENTATION,
  PPTX: ICONS.PREVIEW_PRESENTATION,
  KEY: ICONS.PREVIEW_PRESENTATION,
  XLS: ICONS.PREVIEW_SPREADSHEET,
  XLSX: ICONS.PREVIEW_SPREADSHEET,
  NUMBERS: ICONS.PREVIEW_SPREADSHEET,
  CSV: ICONS.PREVIEW_SPREADSHEET,
  PAGES: ICONS.PREVIEW_DOCUMENT,
  DOC: ICONS.PREVIEW_DOCUMENT,
  DOCX: ICONS.PREVIEW_DOCUMENT,
  PAG: ICONS.PREVIEW_DOCUMENT,
  RTF: ICONS.PREVIEW_DOCUMENT,
  TXT: ICONS.PREVIEW_DOCUMENT,
  GIF: ICONS.PREVIEW_IMAGE,
  JPEG: ICONS.PREVIEW_IMAGE,
  JPG: ICONS.PREVIEW_IMAGE,
  PNG: ICONS.PREVIEW_IMAGE,
  RAR: ICONS.PREVIEW_ZIP,
  ZIP: ICONS.PREVIEW_ZIP
}

export const TEST_IDS = {
  LEFT: 'left',
  RIGHT: 'right',
  NAME_FIELD: 'name-field',
  EMAIL_FIELD: 'email-field',
  SUBJECT_FIELD: 'subject-field',
  MESSAGE_FIELD: 'message-field',
  PHONE_FIELD: 'phone-field',
  SEARCH_FIELD: 'search-field',
  BUTTON_OK: 'button-ok',
  BUTTON_CANCEL: 'button-cancel',
  ERROR_MSG: 'error-message',
  FORM: 'form-component',
  FORM_GREETING_MSG: 'form-greeting-msg',
  FILE_NAME: 'file-name',
  DESCRIPTION: 'description',
  DROPZONE: 'dropzone',
  LABEL: 'label',
  LAUNCHER: 'launcher',
  LAUNCHER_LABEL: 'launcher-label',
  TRANSLATE_LINK: 'translate-link',
  PROGRESS_BAR: 'progress-bar',
  LIST_ITEM: 'list-item',
  CHAT_START: 'chat-start',
  PILL_BUTTON: 'pill-button',
  HEADER_CONTAINER: 'page-header-container',
  PAGE_CONTAINER: 'page-container',
  SLIDE_APPEAR_CONTAINER: 'slide-appear-container',
  SCROLL_CONTAINER: 'scroll-container',
  SCROLL_CONTAINER_CONTENT: 'scroll-container-content',
  SCROLL_CONTAINER_FOOTER: 'scroll-container-footer',
  WIDGET_MAIN_CONTENT: 'scroll-container-content', // Must change to a unique name once ScrollContainer component is no longer used.
  CHAT_HEADER_TEXT_CONTAINER: 'chat-header-text-container',
  CHAT_HEADER_TITLE: 'chat-header-title',
  CHAT_HEADER_SUBTEXT: 'chat-header-subtext',
  CHAT_RATING_GROUP: 'chat-header-rating-group',
  CHAT_MENU: 'chat-menu',
  CHAT_MENU_LIST: 'chat-menu-list',
  CHAT_MENU_ITEM: 'chat-menu-item',
  CHAT_EDIT_CONTACT_DETAILS_POPUP: 'chat-contact-details-popup',
  CHAT_MSG_USER: 'chat-msg-user',
  CHAT_MSG_AGENT: 'chat-msg-agent',
  CHAT_MSG_EVENT: 'chat-msg-event',
  CHAT_MSG_ANSWER_BOT: 'chat-msg-answer-bot',
  CHAT_PRECHAT_FORM: 'chat-prechat-form',
  CHAT_OFFLINE_FORM: 'chat-offline-form',
  CHECKBOX_FIELD: 'checkbox-field',
  STR_MSG_PANEL_HEADING: 'panelHeading',
  DROPDOWN_OPTIONS: 'dropdown-options',
  DROPDOWN_OPTION: 'dropdown-option',
  DROPDOWN_FIELD: 'dropdown-field',
  TALK_OFFLINE_PAGE: 'talk--offlinePage',
  TALK_PHONE_ONLY_PAGE: 'talk--phoneOnlyPage',
  TALK_SUCCESS_PAGE: 'talk--successPage',
  TALK_CALLBACK_PAGE: 'talk--callbackPage',
  TALK_PHONE_PAGE: 'talk--phonePage',
  TALK_AVG_WAIT_TIME: 'talk--averageWaitTime',
  TALK_PHONE_NUMBER: 'talk-phone-number',
  HC_RESULT_ITEM: 'hc-search-result',
  HC_RESULT_TITLE: 'hc-result-title',
  HC_ARTICLE: 'hc-article',
  HC_ARTICLE_TITLE: 'hc-article-title',
  HC_ARTICLE_BODY: 'hc-article-body',
  CC_CONTAINER: 'channel-choice-container',
  AB_SELECTION_MESSAGE: 'answer-bot-selection-message',
  ATTACHMENT_LIST_CONTAINER: 'attachment-list-container',
  ICON_CLOSE: 'Icon--close',
  ICON_ARROW_DOWN: 'Icon--arrow-down',
  ICON_ZENDESK: ICONS.ZENDESK,
  ICON_END_CHAT: ICONS.END_CHAT,
  ICON_ELLIPSIS: ICONS.ELLIPSIS,
  ICON_SEARCH: ICONS.SEARCH,
  ICON_PAPERCLIP_SMALL: ICONS.PAPERCLIP_SMALL,
  ICON_PAPERCLIP_LARGE: ICONS.PAPERCLIP_LARGE,
  ICON_SOUND_ON: ICONS.SOUND_ON,
  ICON_SOUND_OFF: ICONS.SOUND_OFF,
  ICON_DASH: ICONS.DASH,
  ICON_BACK: ICONS.BACK,
  ICON_CLEAR_INPUT: ICONS.CLEAR_INPUT,
  ICON_POPOUT: ICONS.POPOUT,
  ICON_THUMB_UP: ICONS.THUMB_UP,
  ICON_THUMB_DOWN: ICONS.THUMB_DOWN,
  ICON_AVATAR: ICONS.AVATAR,
  ICON_LINK_EXTERNAL: ICONS.LINK_EXTERNAL,
  ICON_CC_SUPPORT: ICONS.CC_SUPPORT,
  ICON_CC_CHAT: ICONS.CC_CHAT,
  ICON_CC_TALK: ICONS.CC_SUPPORT,
  ICON_CC_CLICK_TO_CALL: ICONS.CC_CLICK_TO_CALL,
  ICON_FACEBOOK: ICONS.FACEBOOK,
  ICON_GOOGLE: ICONS.GOOGLE,
  MESSAGE_OPTION: 'message-option',
  CHAT_FOOTER_MENU_BUTTONS: 'chat-footer-menu-buttons',
  CHAT_ATTACHMENT_BUTTON: 'chat-attachment-button',
  IMAGE_MESSAGE_LINK: 'image-message-link',
  LOADING_SPINNER: 'loading-spinner',
  DROPDOWN_SELECTED_VALUE: 'dropdown-selected-value',
  CHAT_MENU_ITEM_BACK: 'chat-menu-item-back',
  CHAT_MENU_ITEM_TOGGLE_SOUND: 'chat-menu-item-toggle-sound',
  CHAT_MENU_ITEM_EMAIL_TRANSCRIPT: 'chat-menu-item-email-transcript',
  CHAT_MENU_ITEM_EDIT_CONTACT_DETAILS: 'chat-menu-item-edit-contact-details',
  CHAT_MENU_ITEM_END_CHAT: 'chat-menu-item-end-chat',
  WIDGET_TITLE: 'widget-title',
  SUCCESS_NOTIFICATION_ICON: 'Icon--success-notification-icon',
  TICKET_FORM_LIST: 'ticket-form-list',
  SUPPORT_TICKET_FORM: 'support-ticket-form',
  CHAT_BADGE: 'chat-badge',
  SUPPORT_SUBMIT_BUTTON: 'support-submit-button'
}

export const GA_CATEGORY = 'Zendesk Web Widget'

// Email regular expression from http://emailregex.com/
export const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
export const PHONE_PATTERN = /^(?=.*[0-9]+).{1,25}$/
export const NAME_PATTERN = /^.{1,255}$/

// maps 'activeEmbed' value to customer facing names
export const EMBED_MAP = {
  ticketSubmissionForm: 'contactForm',
  helpCenterForm: 'helpCenter',
  chat: 'chat',
  talk: 'talk',
  channelChoice: 'contactOptions',
  answerBot: 'answerBot'
}
export const NIL_EMBED = 'nilEmbed'
export const LAUNCHER = 'launcher'

export const FRAME_TRANSITION_DURATION = 250
export const FRAME_ANIMATION_DELAY = FRAME_TRANSITION_DURATION * 2
