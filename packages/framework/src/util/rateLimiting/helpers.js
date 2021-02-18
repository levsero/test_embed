import { store } from 'src/framework/services/persistence'

const RATE_LIMITING_QUEUES = 'rateRimitingQueues'

let queues = store.get(RATE_LIMITING_QUEUES) || {}

export const queuesReset = () => {
  queues = {}
}

export const exponentialBackoffTime = (attempts) => {
  const numberOfAttempts = attempts.length

  if (numberOfAttempts < 1) return 0
  if (numberOfAttempts === 1) return 1000
  const initialDelay = 1000

  return initialDelay * Math.pow(2, numberOfAttempts - 1)
}

const hoursInSeconds = (hours) => hours * 60 * 60 * 1000

export const isRateLimited = (queueName, timestamp) => {
  queues[queueName] = queues[queueName] || []
  const times = queues[queueName]
  const previousAttempt = times[times.length - 1]
  const timeSinceLastAttempt = previousAttempt ? timestamp - previousAttempt : 0
  const delayThreshold = hoursInSeconds(2)

  // Reset after 2 hours
  if (timeSinceLastAttempt > delayThreshold) times.length = 0

  const timeToWait = exponentialBackoffTime(times)

  if (previousAttempt && timeToWait > timeSinceLastAttempt) {
    return true
  }

  times.push(timestamp)
  store.set(RATE_LIMITING_QUEUES, queues)
  return false
}
