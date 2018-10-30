export const HISTORY_REQUEST_STATUS = {
  PENDING: 'pending',
  DONE:    'done',
  FAIL:    'fail'
};

export const WHITELISTED_SOCIAL_LOGINS = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook'
};

export const CHAT_MESSAGE_EVENTS = {
  CHAT_EVENT_MSG:   'chat.msg',
  CHAT_EVENT_FILE:  'chat.file'
};

export const CHAT_CUSTOM_MESSAGE_EVENTS = {
  CHAT_QUICK_REPLIES: 'chat.quick_replies'
};

export const CHAT_SYSTEM_EVENTS = {
  CHAT_EVENT_MEMBERJOIN:      'chat.memberjoin',
  CHAT_EVENT_MEMBERLEAVE:     'chat.memberleave',
  CHAT_EVENT_COMMENT:         'chat.comment',
  CHAT_EVENT_RATING:          'chat.rating',
  CHAT_EVENT_REQUEST_RATING:  'chat.request.rating',
  CHAT_EVENT_CONTACT_DETAILS_UPDATED: 'chat.contact_details.updated'
};

export const ATTACHMENT_ERROR_TYPES = {
  NOT_SUPPORTED:      'not_supported',
  NOT_ALLOWED:        'not_allowed',
  CONN_ERROR:         'conn_error',
  INVALID_EXTENSION:  'invalid_extension',
  EXCEED_SIZE_LIMIT:  'exceed_size_limit',
  INTERNAL_ERROR:     'internal_error',
  UNKNOWN_ERROR:      'unknown_error'
};

export const EDIT_CONTACT_DETAILS_SCREEN = 'widget/chat/EDIT_CONTACT_DETAILS_SCREEN';
export const EDIT_CONTACT_DETAILS_LOADING_SCREEN = 'widget/chat/EDIT_CONTACT_DETAILS_LOADING_SCREEN';
export const EDIT_CONTACT_DETAILS_ERROR_SCREEN = 'widget/chat/EDIT_CONTACT_DETAILS_ERROR_SCREEN';

export const CHAT_SOCIAL_LOGIN_SCREENS = {
  LOGOUT_PENDING: 'widget/chat/CHAT_SOCIAL_LOGOUT_PENDING',
  LOGOUT_SUCCESS: 'widget/chat/CHAT_SOCIAL_LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'widget/chat/CHAT_SOCIAL_LOGOUT_FAILURE'
};

export const OFFLINE_FORM_SCREENS = {
  MAIN: 'widget/chat/OFFLINE_FORM_MAIN_SCREEN',
  LOADING: 'widget/chat/OFFLINE_FORM_LOADING_SCREEN',
  SUCCESS: 'widget/chat/OFFLINE_FORM_SUCCESS_SCREEN',
  OPERATING_HOURS: 'widget/chat/OFFLINE_FORM_OPERATING_HOURS_SCREEN'
};

export const CHAT_MESSAGE_TYPES = {
  CHAT_MESSAGE_SUCCESS: 'CHAT_MESSAGE_SUCCESS',
  CHAT_MESSAGE_FAILURE: 'CHAT_MESSAGE_FAILURE',
  CHAT_MESSAGE_PENDING: 'CHAT_MESSAGE_PENDING'
};

export const AGENT_BOT = 'agent:trigger';
export const EVENT_TRIGGER = '__trigger';

export const CONNECTION_STATUSES = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  CLOSED: 'closed'
};

export const DEPARTMENT_STATUSES = {
  ONLINE: 'online',
  OFFLINE: 'offline'
};

export const SDK_ACTION_TYPE_PREFIX = 'websdk';

export const JWT_ERROR = 'jwt verification error';

export const SCROLL_BOTTOM_THRESHOLD = 200; // Unit in px

export const CHAT_STRUCTURED_CONTENT_TYPE = {
  QUICK_REPLIES: 'QUICK_REPLIES',
  CHAT_STRUCTURED_MESSAGE_TYPE: {
    BUTTON_TEMPLATE: 'BUTTON_TEMPLATE',
    PANEL_TEMPLATE: 'PANEL_TEMPLATE'
  }
};

export const TIMEOUT = 5000;

export const CHAT_STRUCTURED_MESSAGE_ACTION_TYPE = {
  QUICK_REPLY_ACTION: 'QUICK_REPLY_ACTION',
  LINK_ACTION: 'LINK_ACTION',
};
