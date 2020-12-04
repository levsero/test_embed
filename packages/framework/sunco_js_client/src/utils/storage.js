const win = window.parent
let instance = null
export const DEFAULT_STORAGE_TYPE = 'localStorage'

class Store {
  constructor() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key]
  }

  setItem(key, value) {
    this.store[key] = value
  }
}

class LocalStore extends Store {
  constructor() {
    super()
    this.store = win.localStorage
  }
}

class SessionStore extends Store {
  constructor() {
    super()
    this.store = win.sessionStorage
  }
}

// From: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
const storageAvailable = type => {
  var storage
  try {
    storage = win[type]
    var x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0)
    )
  }
}

const webStorage = () => {
  if (instance) return instance
  setStorageType({ type: DEFAULT_STORAGE_TYPE })
  return instance
}

const setStorageType = ({ type }) => {
  try {
    if (!storageAvailable(type)) {
      throw `WebStorage type: ${type} is unavailable on this device - falling back to in memory store`
    }
    switch (type) {
      case 'sessionStorage':
        instance = new SessionStore()
        break

      case 'localStorage':
        instance = new LocalStore()
        break
    }
  } catch (err) {
    instance = new Store()
  }
}

export default {
  setStorageType,
  getItem: key => webStorage().getItem(key),
  setItem: (key, value) => webStorage().setItem(key, value)
}
