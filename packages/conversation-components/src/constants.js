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

export { BANNER_STATUS, FORM_MESSAGE_STATUS, MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS }
