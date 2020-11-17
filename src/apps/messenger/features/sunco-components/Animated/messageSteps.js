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

delay = 0.15
const messageBorder = createStep({ delay, duration: 0.15 })

delay = 0.3
const messageEnter = createStep({ delay, duration: 0.5, fill: 'both' })

delay = 0.6
const tailEnter = createStep({ delay, timing: bezierCurve })

delay = 0.9
const textEnter = createStep({ delay, timing: 'ease' })

const transition = (options, ...properties) =>
  properties
    .map(property => `${property} ${options.duration}s ${options.timing} ${options.delay}s`)
    .join(', ')

const animation = (options, keyframe) => css`
  ${keyframe} ${options.duration}s ${options.timing} ${options.delay}s ${options.fill}
`

const messageStatusOpacity = createStep({ delay: 0 })

const messageSteps = {
  tailEnter,
  tailExit,
  textEnter,
  textExit,
  messageBorder,
  messageEnter,
  messageStatusOpacity
}

export default messageSteps
export { transition, createStep, animation }
