export const CHAT_MESSAGE_EVENTS = {
  CHAT_EVENT_MSG:   'chat.msg',
  CHAT_EVENT_FILE:  'chat.file'
};

export const CHAT_SYSTEM_EVENTS = {
  CHAT_EVENT_MEMBERJOIN:      'chat.memberjoin',
  CHAT_EVENT_MEMBERLEAVE:     'chat.memberleave',
  CHAT_EVENT_COMMENT:         'chat.comment',
  CHAT_EVENT_RATING:          'chat.rating',
  CHAT_EVENT_REQUEST_RATING:  'chat.request.rating'
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
