function mockZChat(zChat) {
  const mocks = {},
    subscribers = {}
  return new Proxy(zChat, {
    get(target, prop) {
      if (prop === 'getFirehose') {
        return mockFirehose(subscribers)
      } else if (prop === 'init') {
        return mockInit()
      } else if (prop === 'setOnFirstReady') {
        return mockSetOnFirstReady(this)
      } else if (prop === '__mock__') {
        return setMock(mocks)
      } else if (prop === '__fire__') {
        return fireEvent(subscribers, this)
      }
      return mocks[prop] || noop
    },
  })
}

function mockAuthentication(config) {
  const jwtFn = config.authentication.jwt_fn
  jwtFn((token) => {
    fetch('https://id.zopim.com/authenticated/web/jwt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_key: config.account_key,
        token: token,
      }),
    })
  })
}

function mockInit() {
  return (config) => {
    if (config.authentication) {
      mockAuthentication(config)
    }
  }
}

function mockSetOnFirstReady(target) {
  return (obj) => (target.setOnFirstReady = obj)
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
    },
  })
}

function initialSettings(obj) {
  const payload = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const func = obj[key]
      if (typeof func === 'function') {
        payload[key] = func.call()
      }
    }
  }
  return payload
}

function fireEvent(subscribers, target) {
  return (event, payload) => {
    if (
      event === 'data' &&
      payload.type === 'connection_update' &&
      payload.detail === 'connected'
    ) {
      const detail = initialSettings(target.setOnFirstReady)
      subscribers['data'].forEach((cb) => {
        cb({
          type: 'initialSettings',
          detail,
        })
      })
    }
    if (subscribers[event]) {
      subscribers[event].forEach((cb) => {
        cb(payload)
      })
    }
  }
}

export default mockZChat
