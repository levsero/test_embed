const BANNER_STATUS = Object.freeze({
  success: 'success',
  fatal: 'fatal',
})

const FORM_MESSAGE_STATUS = Object.freeze({
  unsubmitted: 'unsubmitted',
  pending: 'pending',
  success: 'success',
  failed: 'failed',
})

const MESSAGE_BUBBLE_SHAPES = Object.freeze({
  standalone: 'standalone',
  first: 'first',
  middle: 'middle',
  last: 'last',
})

const MESSAGE_STATUS = Object.freeze({
  sending: 'sending',
  sent: 'sent',
  failed: 'failed',
})

const MESSAGE_TYPES = Object.freeze({
  text: 'text',
  file: 'file',
  image: 'image',
  carousel: 'carousel',
  formResponse: 'formResponse',
  timestamp: 'timestamp',
})

const FILE_UPLOAD_ERROR_TYPES = Object.freeze({
  unknown: 'unknown',
  fileSize: 'fileSize',
  tooMany: 'tooMany',
})

const NOTIFICATION_TYPES = Object.freeze({
  connectError: 'connectError',
  disconnectError: 'disconnectError',
})

const FRAME_MARGIN_FROM_PAGE = 16
const FRAME_ANIMATION_DURATION = 0.7

const LAUNCHER_SHAPES = Object.freeze({
  square: 'square',
  circle: 'circle',
})

const LAUNCHER_POSITION = ['left', 'right']

export {
  BANNER_STATUS,
  FORM_MESSAGE_STATUS,
  MESSAGE_BUBBLE_SHAPES,
  MESSAGE_TYPES,
  MESSAGE_STATUS,
  FRAME_MARGIN_FROM_PAGE,
  FRAME_ANIMATION_DURATION,
  NOTIFICATION_TYPES,
  FILE_UPLOAD_ERROR_TYPES,
  LAUNCHER_SHAPES,
  LAUNCHER_POSITION,
}
