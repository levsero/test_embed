function mockZChat(zChat) {
  const mocks = {},
    subscribers = {}
  return new Proxy(zChat, {
    get(target, prop) {
      if (prop === 'getFirehose') {
        return mockFirehose(subscribers)
      } else if (prop === '__mock__') {
        return setMock(mocks)
      } else if (prop === '__fire__') {
        return fireEvent(subscribers)
      }
      return mocks[prop] || noop
    }
  })
}

function noop() {}

function setMock(mocks) {
  return (fn, impl) => (mocks[fn] = impl)
}

function mockFirehose(subscribers) {
  return () => ({
    on: (event, cb) => {
      if (subscribers[event]) {
        subscribers[event].push(cb)
      } else {
        subscribers[event] = [cb]
      }
    }
  })
}

function fireEvent(subscribers) {
  return (event, payload) => {
    if (subscribers[event]) {
      subscribers[event].forEach(cb => {
        cb(payload)
      })
    }
  }
}

export default mockZChat
