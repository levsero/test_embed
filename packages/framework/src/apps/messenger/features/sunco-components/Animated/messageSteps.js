import { bezierCurve } from 'src/apps/messenger/constants'
import { css } from 'styled-components'

const createStep = (propertyOptions = {}) => ({
  duration: 0.3,
  delay: 0,
  timing: 'linear',
  ...propertyOptions
})

let delay = 0
const tailExit = createStep({ delay, timing: bezierCurve, duration: 0.15 })
const textExit = createStep({ delay, timing: 'ease' })
const existingRepliesEnter = createStep({ delay, duration: 0 })
const repliesExit = createStep({ delay, duration: 0 })
const receiptEnter = createStep({ delay, duration: 0 })
const messageStatusOpacity = createStep({ delay })

delay = 0.15
const messageBorder = createStep({ delay, duration: 0.15 })

delay = 0.3
const messageEnter = createStep({ delay, duration: 0.5, fill: 'both' })
const repliesFadeIn = createStep({ delay, duration: 0.3 })
const receiptReenter = createStep({ delay, duration: 0.3 })
const receiptExit = createStep({ delay, duration: 0 })

delay = 0.6
const tailEnter = createStep({ delay, timing: bezierCurve })

delay = 0.7
const freshRepliesEnter = createStep({ delay, duration: 0 })

delay = 0.9
const textEnter = createStep({ delay, timing: 'ease' })

// Helper function that generates the CSS required for a transition
// e.g. transition(textEnter, 'opacity', 'color) -> opacity 0.3s ease 0.9s, color 0.3s ease 0.9s;
const transition = (options, ...properties) =>
  properties
    .map(property => `${property} ${options.duration}s ${options.timing} ${options.delay}s`)
    .join(', ')

// Helper function that generates the CSS required for an animation
// e.g. animation(messageEnter, keyframe) -> keyframe 0.3s 0.3s both
const animation = (options, keyframe) => css`
  ${keyframe} ${options.duration}s ${options.timing} ${options.delay}s ${options.fill}
`

const messageSteps = {
  tailEnter,
  tailExit,
  textEnter,
  textExit,
  messageBorder,
  messageEnter,
  messageStatusOpacity,
  existingRepliesEnter,
  freshRepliesEnter,
  repliesExit,
  repliesFadeIn,
  receiptEnter,
  receiptReenter,
  receiptExit
}

export default messageSteps
export { transition, createStep, animation }
