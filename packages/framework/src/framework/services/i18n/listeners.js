let listeners = []

const subscribe = callback => {
  listeners.push(callback)

  const unsubscribe = () => {
    listeners = listeners.filter(c => c !== callback)
  }

  return unsubscribe
}

const notifyAll = () => {
  listeners.forEach(callback => callback())
}

export default {
  subscribe,
  notifyAll
}
