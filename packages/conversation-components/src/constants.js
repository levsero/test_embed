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

const FRAME_MARGIN_FROM_PAGE = 16
const FRAME_ANIMATION_DURATION = 0.7

export {
  BANNER_STATUS,
  FORM_MESSAGE_STATUS,
  MESSAGE_BUBBLE_SHAPES,
  MESSAGE_STATUS,
  FRAME_MARGIN_FROM_PAGE,
  FRAME_ANIMATION_DURATION,
}
