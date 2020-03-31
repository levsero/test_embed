import _ from 'lodash'

import { win } from 'utility/globals'

const prefix = __EMBEDDABLE_FRAMEWORK_ENV__ === 'e2e' ? `ZD-${Date.now()}-` : 'ZD-'

// TODO: find a better way to differentiate between localStorage
// and sessionStorage, and refactor everywhere it is used

let enabled = true

const storage = type => win[`${type}Storage`]

const defaults = {
  suid: {
    id: null,
    tabs: []
  },
  store: {}
}

function get(name, type = 'local') {
  try {
    const data = deserialize(storage(type).getItem(prefix + name))

    return data ? data : defaults[name] || null
  } catch (e) {}

  return defaults[name]
}

function set(name, data, type = 'local') {
  if (!enabled) return data

  try {
    storage(type).setItem(prefix + name, serialize(data))
  } catch (e) {}

  return data
}

function remove(name, type = 'local') {
  try {
    storage(type).removeItem(prefix + name)
  } catch (e) {}
}

function clear(type = 'local') {
  try {
    const backend = storage(type)
    const keys = _.keys(backend).filter(key => _.includes(key, prefix))

    keys.forEach(key => {
      backend.removeItem(key)
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
  get: get,
  set: set,
  remove: remove,
  clear: clear,
  enable: enable,
  disable: disable,
  prefix
}
