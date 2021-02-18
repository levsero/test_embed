import _ from 'lodash'

const win = window.parent
const prefix = __EMBEDDABLE_FRAMEWORK_ENV__ === 'e2e' ? `ZD-${Date.now()}-` : 'ZD-'

let enabled = true

let defaultStorage = win.localStorage

const defaults = {
  suid: {
    id: null,
    tabs: [],
  },
  store: {},
}

const enableSessionStorage = () => {
  try {
    win.sessionStorage.setItem('ZD-testStorage', 'true')
    win.sessionStorage.removeItem('ZD-testStorage')
  } catch (err) {
    return false
  }
  defaultStorage = win.sessionStorage
  return true
}

const enableLocalStorage = () => {
  try {
    win.localStorage.setItem('ZD-testStorage', 'true')
    win.localStorage.removeItem('ZD-testStorage')
  } catch (err) {
    return false
  }

  defaultStorage = win.localStorage
  return true
}

function get(name, storageType) {
  const storage = storageType || defaultStorage

  try {
    const data = deserialize(storage.getItem(prefix + name))

    return data ? data : defaults[name] || null
  } catch (e) {}

  return defaults[name]
}

function set(name, data, storageType) {
  if (!enabled) return data
  const storage = storageType || defaultStorage

  try {
    storage.setItem(prefix + name, serialize(data))
  } catch (e) {}

  return data
}

function sessionStorageSet(name, data) {
  return set(name, data, win.sessionStorage)
}

function sessionStorageGet(name) {
  return get(name, win.sessionStorage)
}

function remove(name) {
  try {
    defaultStorage.removeItem(prefix + name)
  } catch (e) {}
}

function clear() {
  try {
    const keys = _.keys(defaultStorage).filter((key) => _.includes(key, prefix))

    keys.forEach((key) => {
      defaultStorage.removeItem(key)
    })
  } catch (e) {}
}

function enable() {
  enabled = true
}

function disable() {
  enabled = false
  clear()
}

function serialize(data) {
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  return data
}

function deserialize(data) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

export const store = {
  enableLocalStorage,
  enableSessionStorage,
  sessionStorageSet,
  sessionStorageGet,
  get: get,
  set: set,
  remove: remove,
  clear: clear,
  enable: enable,
  disable: disable,
  prefix,
}
