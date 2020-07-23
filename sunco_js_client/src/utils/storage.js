let storage

export function init(options) {
  storage = new Storage(options)
}

class Storage {
  constructor(options = {}) {
    this.memoryStorage = {}

    try {
      switch (options.type) {
        case 'sessionStorage':
          this.browserStorage = global.sessionStorage
          break
        case 'localStorage':
          this.browserStorage = global.localStorage
          break
        default:
          this.browserStorage = global.localStorage
      }
    } catch (err) {
      // Browsers configured to deny access to localStorage will throw an error if attempted
    }
  }

  reset() {
    this.memoryStorage = {}
  }

  setItem(key, value) {
    try {
      if (this.browserStorage) {
        // Safari with privacy options will have localStorage
        // but won't let us write to it.
        this.browserStorage.setItem(key, value)

        // Write to memory as well in case
        // we can't read localStorage
        this.memoryStorage[key] = value
      } else {
        // Android WebView might not have localStorage at all.
        this.memoryStorage[key] = value
      }
    } catch (err) {
      // Browsers configured to deny access to localStorage will throw an error if attempted
      this.memoryStorage[key] = value
    }
  }

  getItem(key) {
    let value

    try {
      if (this.memoryStorage[key]) {
        value = this.memoryStorage[key]
      } else if (this.browserStorage) {
        this.memoryStorage[key] = this.browserStorage.getItem(key)
        value = this.memoryStorage[key]
      }
    } catch (err) {
      // Browsers configured to deny access to localStorage will throw an error if attempted
    }

    // per localStorage spec, it returns null when not found
    return value || null
  }

  removeItem(key) {
    delete this.memoryStorage[key]

    try {
      this.browserStorage && this.browserStorage.removeItem(key)
    } catch (err) {
      // Browsers configured to deny access to localStorage will throw an error if attempted
    }
  }

  getItems(prefix, keys) {
    return keys.map(key => this.getItem(`${prefix}.${key}`))
  }

  setItems(prefix, options = {}) {
    Object.keys(options).forEach(key => {
      this.setItem(`${prefix}.${key}`, options[key])
    })
  }

  removeItems(prefix, keys) {
    keys.forEach(key => {
      this.removeItem(`${prefix}.${key}`)
    })
  }
}

export function reset() {
  if (!storage) {
    init()
  }

  return storage.reset()
}

export function setItem(key, value) {
  if (!storage) {
    init()
  }

  return storage.setItem(key, value)
}

export function getItem(key, value) {
  if (!storage) {
    init()
  }

  return storage.getItem(key, value)
}

export function removeItem(key) {
  if (!storage) {
    init()
  }

  storage.removeItem(key)
}

export function getItems(prefix, keys) {
  if (!storage) {
    init()
  }

  return storage.getItems(prefix, keys)
}

export function setItems(prefix, options) {
  if (!storage) {
    init()
  }

  return storage.setItems(prefix, options)
}

export function removeItems(prefix, keys) {
  if (!storage) {
    init()
  }

  return storage.removeItems(prefix, keys)
}
