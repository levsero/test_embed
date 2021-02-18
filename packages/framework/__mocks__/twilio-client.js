let __testDevice

class ObserverList {
  constructor() {
    this.observers = []
  }

  addObserver(callback) {
    if (!this.observers.includes(callback)) {
      this.observers.push(callback)
    }
  }

  removeObserver(callback) {
    this.observers = this.observers.filter((observer) => observer !== callback)
  }

  notify(...args) {
    this.observers.forEach((callback) => {
      callback(...args)
    })
  }
}

const MockTwilioConnection = jest.fn().mockImplementation((_options) => {
  const eventObservers = {
    accept: new ObserverList(),
    disconnect: new ObserverList(),
  }

  const disconnect = () => {
    eventObservers['disconnect'].notify()
  }

  const on = (eventType, callback) => {
    eventObservers[eventType].addObserver(callback)
  }

  return {
    on,
    disconnect: () => disconnect.call(this),
  }
})

class MockTwilioDevice {
  constructor() {
    this.connection = null
    this.eventObservers = {
      connect: new ObserverList(),
      disconnect: new ObserverList(),
      error: new ObserverList(),
      ready: new ObserverList(),
      accept: new ObserverList(),
    }
  }

  on(eventType, callback) {
    this.eventObservers[eventType].addObserver(callback)
  }

  __trigger(eventType, ...args) {
    this.eventObservers[eventType].notify(...args)
  }

  setup() {
    this.eventObservers['ready'].notify()
  }

  connect(options = {}) {
    this.connection = new MockTwilioConnection(options)
    this.connection.on('disconnect', () => {
      this.eventObservers['disconnect'].notify(this.connection)
    })
    this.eventObservers['connect'].notify()
    return this.connection
  }

  destroy() {}
}

const Device = jest.fn().mockImplementation(() => {
  __testDevice = new MockTwilioDevice()
  return __testDevice
})

Device.isSupported = true
Device.__resetMocks = () => {
  __testDevice = undefined
}

Device.__triggerError = (error) => {
  __testDevice?.__trigger('error', error)
}

export { Device }
