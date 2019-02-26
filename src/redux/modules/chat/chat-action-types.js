import { SDK_ACTION_TYPE_PREFIX } from '../../../../src/constants/chat';

export const API_FORCE_STATUS_CALLED = 'widget/chat/API_FORCE_STATUS_CALLED';
export const END_CHAT_REQUEST_SUCCESS = 'widget/chat/END_CHAT_REQUEST_SUCCESS';
export const END_CHAT_REQUEST_FAILURE = 'widget/chat/END_CHAT_REQUEST_FAILURE';
export const CHAT_MSG_REQUEST_SENT = 'widget/chat/CHAT_MSG_REQUEST_SENT';
export const CHAT_MSG_REQUEST_SUCCESS = 'widget/chat/CHAT_MSG_REQUEST_SUCCESS';
export const CHAT_MSG_REQUEST_FAILURE = 'widget/chat/CHAT_MSG_REQUEST_FAILURE';
export const SET_VISITOR_INFO_REQUEST_PENDING = 'widget/chat/SET_VISITOR_INFO_REQUEST_PENDING';
export const SET_VISITOR_INFO_REQUEST_SUCCESS = 'widget/chat/SET_VISITOR_INFO_REQUEST_SUCCESS';
export const SET_VISITOR_INFO_REQUEST_FAILURE = 'widget/chat/SET_VISITOR_INFO_REQUEST_FAILURE';
export const SEND_VISITOR_PATH_REQUEST_SUCCESS = 'widget/chat/SEND_VISITOR_PATH_REQUEST_SUCCESS';
export const SEND_VISITOR_PATH_REQUEST_FAILURE = 'widget/chat/SEND_VISITOR_PATH_REQUEST_FAILURE';
export const GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS = 'widget/chat/GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS';
export const GET_OPERATING_HOURS_REQUEST_SUCCESS = 'widget/chat/GET_OPERATING_HOURS_REQUEST_SUCCESS';
export const IS_CHATTING = 'widget/chat/IS_CHATTING';
export const CHAT_STARTED = 'widget/chat/CHAT_STARTED';
export const CHAT_CONNECTED = 'widget/chat/CHAT_CONNECTED';
export const CHAT_RATING_REQUEST_SUCCESS = 'widget/chat/CHAT_RATING_REQUEST_SUCCESS';
export const CHAT_RATING_REQUEST_FAILURE = 'widget/chat/CHAT_RATING_REQUEST_FAILURE';
export const CHAT_BOX_CHANGED = 'widget/chat/CHAT_BOX_CHANGED';
export const CHAT_RATING_COMMENT_REQUEST_SUCCESS = 'widget/chat/CHAT_RATING_COMMENT_REQUEST_SUCCESS';
export const CHAT_RATING_COMMENT_REQUEST_FAILURE = 'widget/chat/CHAT_RATING_COMMENT_REQUEST_FAILURE';
export const CHAT_FILE_REQUEST_SUCCESS = 'widget/chat/CHAT_FILE_REQUEST_SUCCESS';
export const CHAT_FILE_REQUEST_FAILURE = 'widget/chat/CHAT_FILE_REQUEST_FAILURE';
export const CHAT_FILE_REQUEST_SENT = 'widget/chat/CHAT_FILE_REQUEST_SENT';
export const SOUND_ICON_CLICKED = 'widget/chat/SOUND_ICON_CLICKED';
export const UPDATE_CHAT_SCREEN = 'widget/chat/UPDATE_CHAT_SCREEN';
export const NEW_AGENT_MESSAGE_RECEIVED = 'widget/chat/NEW_AGENT_MESSAGE_RECEIVED';
export const CHAT_OPENED = 'widget/chat/CHAT_OPENED';
export const CHAT_WINDOW_OPEN_ON_NAVIGATE = 'widget/chat/CHAT_WINDOW_OPEN_ON_NAVIGATE';
export const PROACTIVE_CHAT_RECEIVED = 'widget/chat/PROACTIVE_CHAT_RECEIVED';
export const PROACTIVE_CHAT_NOTIFICATION_DISMISSED = 'widget/chat/PROACTIVE_CHAT_NOTIFICATION_DISMISSED';
export const EMAIL_TRANSCRIPT_REQUEST_SENT = 'widget/chat/EMAIL_TRANSCRIPT_REQUEST_SENT';
export const EMAIL_TRANSCRIPT_SUCCESS = 'widget/chat/EMAIL_TRANSCRIPT_SUCCESS';
export const EMAIL_TRANSCRIPT_FAILURE = 'widget/chat/EMAIL_TRANSCRIPT_FAILURE';
export const EMAIL_TRANSCRIPT_IDLE = 'widget/chat/EMAIL_TRANSCRIPT_IDLE';
export const RESET_EMAIL_TRANSCRIPT = 'widget/chat/RESET_EMAIL_TRANSCRIPT';
export const CHAT_NOTIFICATION_DISMISSED = 'widget/chat/CHAT_NOTIFICATION_DISMISSED';
export const CHAT_NOTIFICATION_RESPONDED = 'widget/chat/CHAT_NOTIFICATION_RESPONDED';
export const CHAT_NOTIFICATION_RESET = 'widget/chat/CHAT_NOTIFICATION_RESET';
export const CHAT_OFFLINE_FORM_CHANGED = 'widget/chat/CHAT_OFFLINE_FORM_CHANGED';
export const PRE_CHAT_FORM_ON_CHANGE = 'widget/chat/PRE_CHAT_FORM_ON_CHANGE';
export const PRE_CHAT_FORM_SUBMIT = 'widget/chat/PRE_CHAT_FORM_SUBMIT';
export const OFFLINE_FORM_REQUEST_SENT = 'widget/chat/OFFLINE_FORM_REQUEST_SENT';
export const OFFLINE_FORM_REQUEST_SUCCESS = 'widget/chat/OFFLINE_FORM_REQUEST_SUCCESS';
export const OFFLINE_FORM_REQUEST_FAILURE = 'widget/chat/OFFLINE_FORM_REQUEST_FAILURE';
export const OFFLINE_FORM_BACK_BUTTON_CLICKED = 'widget/chat/OFFLINE_FORM_BACK_BUTTON_CLICKED';
export const OFFLINE_FORM_OPERATING_HOURS_LINK_CLICKED = 'widget/chat/OFFLINE_FORM_OPERATING_HOURS_LINK_CLICKED';
export const CHAT_RECONNECT = 'widget/chat/CHAT_RECONNECT';
export const UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY = 'widget/chat/UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY';
export const UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY = 'widget/chat/UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY';
export const UPDATE_CHAT_MENU_VISIBILITY = 'widget/chat/UPDATE_CHAT_MENU_VISIBILITY';
export const RESET_CURRENT_MESSAGE = 'widget/chat/RESET_CURRENT_MESSAGE';
export const SHOW_STANDALONE_MOBILE_NOTIFICATION = 'widget/chat/SHOW_STANDALONE_MOBILE_NOTIFICATION';
export const CHAT_ALL_AGENTS_INACTIVE = 'widget/chat/CHAT_ALL_AGENTS_INACTIVE';
export const CHAT_AGENT_INACTIVE = 'widget/chat/CHAT_AGENT_INACTIVE';
export const HISTORY_REQUEST_SENT = 'widget/chat/HISTORY_REQUEST_SENT';
export const HISTORY_REQUEST_SUCCESS = 'widget/chat/HISTORY_REQUEST_SUCCESS';
export const HISTORY_REQUEST_FAILURE = 'widget/chat/HISTORY_REQUEST_FAILURE';
export const UPDATE_PREVIEWER_SCREEN = 'widget/chat/UPDATE_PREVIEWER_SCREEN';
export const UPDATE_PREVIEWER_SETTINGS = 'widget/chat/UPDATE_PREVIEWER_SETTINGS';
export const PREVIEWER_LOADED = 'widget/chat/PREVIEWER_LOADED';
export const CHAT_SOCIAL_LOGIN_SUCCESS = 'widget/chat/CHAT_SOCIAL_LOGIN_SUCCESS';
export const CHAT_SOCIAL_LOGOUT_PENDING = 'widget/chat/CHAT_SOCIAL_LOGOUT_PENDING';
export const CHAT_SOCIAL_LOGOUT_SUCCESS = 'widget/chat/CHAT_SOCIAL_LOGOUT_SUCCESS';
export const CHAT_SOCIAL_LOGOUT_FAILURE = 'widget/chat/CHAT_SOCIAL_LOGOUT_FAILURE';
export const AUTHENTICATION_STARTED = 'widget/chat/AUTHENTICATION_STARTED';
export const AUTHENTICATION_FAILED = 'widget/chat/AUTHENTICATION_FAILED';
export const CHAT_VENDOR_LOADED = 'widget/chat/CHAT_VENDOR_LOADED';
export const CHAT_USER_LOGGING_OUT = 'widget/chat/CHAT_USER_LOGGING_OUT';
export const CHAT_USER_LOGGED_OUT = 'widget/chat/CHAT_USER_LOGGED_OUT';
export const VISITOR_DEFAULT_DEPARTMENT_SELECTED = 'widget/chat/VISITOR_DEFAULT_DEPARTMENT_SELECTED';
export const UPDATE_CHAT_CONTACT_DETAILS_INFO = 'widget/chat/UPDATE_CHAT_CONTACT_DETAILS_INFO';
export const CHAT_CONTACT_DETAILS_UPDATE_SUCCESS = 'widget/chat/CHAT_CONTACT_DETAILS_UPDATE_SUCCESS';
export const CHAT_BADGE_MESSAGE_CHANGED = 'widget/chat/CHAT_BADGE_MESSAGE_CHANGED';
export const CHAT_BANNED = 'widget/chat/CHAT_BANNED';

export const SDK_ERROR = `${SDK_ACTION_TYPE_PREFIX}/error`;
export const SDK_CHAT_MSG = `${SDK_ACTION_TYPE_PREFIX}/chat.msg`;
export const SDK_CHAT_FILE = `${SDK_ACTION_TYPE_PREFIX}/chat.file`;
export const SDK_CHAT_QUEUE_POSITION = `${SDK_ACTION_TYPE_PREFIX}/chat.queue_position`;
export const SDK_CHAT_MEMBER_JOIN = `${SDK_ACTION_TYPE_PREFIX}/chat.memberjoin`;
export const SDK_CHAT_MEMBER_LEAVE = `${SDK_ACTION_TYPE_PREFIX}/chat.memberleave`;
export const SDK_CHAT_REQUEST_RATING = `${SDK_ACTION_TYPE_PREFIX}/chat.request.rating`;
export const SDK_CHAT_RATING = `${SDK_ACTION_TYPE_PREFIX}/chat.rating`;
export const SDK_CHAT_COMMENT = `${SDK_ACTION_TYPE_PREFIX}/chat.comment`;
export const SDK_CHAT_TYPING = `${SDK_ACTION_TYPE_PREFIX}/typing`;
export const SDK_CHAT_LAST_READ = `${SDK_ACTION_TYPE_PREFIX}/last_read`;
export const SDK_AGENT_UPDATE = `${SDK_ACTION_TYPE_PREFIX}/agent_update`;
export const SDK_VISITOR_UPDATE = `${SDK_ACTION_TYPE_PREFIX}/visitor_update`;
export const SDK_DEPARTMENT_UPDATE = `${SDK_ACTION_TYPE_PREFIX}/department_update`;
export const SDK_CONNECTION_UPDATE = `${SDK_ACTION_TYPE_PREFIX}/connection_update`;
export const SDK_ACCOUNT_STATUS = `${SDK_ACTION_TYPE_PREFIX}/account_status`;
export const SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE = `${SDK_ACTION_TYPE_PREFIX}/visitor_default_department_update`;

export const SDK_HISTORY_CHAT_MSG = `${SDK_ACTION_TYPE_PREFIX}/history/chat.msg`;
export const SDK_HISTORY_CHAT_FILE = `${SDK_ACTION_TYPE_PREFIX}/history/chat.file`;
export const SDK_HISTORY_CHAT_QUEUE_POSITION = `${SDK_ACTION_TYPE_PREFIX}/history/chat.queue_position`;
export const SDK_HISTORY_CHAT_MEMBER_JOIN = `${SDK_ACTION_TYPE_PREFIX}/history/chat.memberjoin`;
export const SDK_HISTORY_CHAT_MEMBER_LEAVE = `${SDK_ACTION_TYPE_PREFIX}/history/chat.memberleave`;
export const SDK_HISTORY_CHAT_REQUEST_RATING = `${SDK_ACTION_TYPE_PREFIX}/history/chat.request.rating`;
export const SDK_HISTORY_CHAT_RATING = `${SDK_ACTION_TYPE_PREFIX}/history/chat.rating`;
export const SDK_HISTORY_CHAT_COMMENT = `${SDK_ACTION_TYPE_PREFIX}/history/chat.comment`;
