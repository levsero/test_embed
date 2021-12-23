export const CONTACT_OPTIONS = {
  CALLBACK_ONLY: 'widget/talk/CALLBACK_ONLY',
  PHONE_ONLY: 'widget/talk/PHONE_ONLY',
  CALLBACK_AND_PHONE: 'widget/talk/CALLBACK_AND_PHONE',
  CLICK_TO_CALL: 'widget/talk/CLICK_TO_CALL',
}

export const CAPABILTY_NAMES = {
  'widget/talk/CALLBACK_ONLY': 'Request a callback',
  'widget/talk/PHONE_ONLY': 'Call us',
  'widget/talk/CALLBACK_AND_PHONE': 'Request a callback and call us',
  'widget/talk/CLICK_TO_CALL': 'Click to call',
}

export const TEST_IDS = {
  BUTTON_HANG_UP: 'button-hang-up',
  ICON_AVATAR: 'Icon--avatar',
}

export const BASE_TALK_POLL_INTERVAL = 60000 // milliseconds
export const MAX_TALK_POLL_INTERVAL = 1000 * 60 * 30 // milliseconds
export const REQUESTS_BEFORE_BACKOFF = 1
