import { v4 as uuidv4 } from 'uuid'
import { store } from 'src/framework/services/persistence'
import { onBrowserTabHidden } from 'src/framework/utils/browser'

const timeToExpire = 1000 * 60 * 15 // 15 Minutes
const tabTimeToExpire = 1000 * 30 // 30 Seconds

let userIdentity = {
  name: null,
  email: null,
  phone: null,
}

const generateUid = () => uuidv4().replace(/-/g, '')

const setSuid = (id, expiry, tabCount, tabExpiry) => {
  return store.set('suid', {
    id: id,
    expiry: expiry,
    tabs: {
      count: tabCount,
      expiry: tabExpiry,
    },
  })
}

const checkSuid = (suid) => {
  const now = Date.now()

  // If the session hasn't expired
  // if there is more then one tab or tab hasn't expired
  return suid && suid.expiry > now && (suid.tabs.count !== 0 || suid.tabs.expiry > now)
}

function init() {
  const suid = store.get('suid')
  const expiry = Date.now() + timeToExpire

  checkSuid(suid)
    ? setSuid(suid.id, expiry, suid.tabs.count + 1, 0)
    : setSuid(generateUid(), expiry, 1, 0)

  onBrowserTabHidden(identity.unload)
}

function setBuid(buid) {
  store.set('buid', buid)
}

function getBuid() {
  let buid = store.get('buid')

  if (!buid) {
    buid = store.set('buid', generateUid())
  }

  return buid
}

function getSuid() {
  const suid = store.get('suid')
  const expiry = Date.now() + timeToExpire

  return checkSuid(suid) ? suid : setSuid(generateUid(), expiry, 1, 0)
}

function setUserIdentity(user = {}) {
  userIdentity = user
}

function getUserIdentity() {
  return userIdentity
}

function unload() {
  const now = Date.now()
  const suid = store.get('suid')
  const tabExpiry = now + tabTimeToExpire

  if (suid) {
    setSuid(suid.id, suid.expiry, suid.tabs.count - 1, tabExpiry)
  }
}

export const identity = {
  setBuid: setBuid,
  getBuid: getBuid,
  getSuid: getSuid,
  setUserIdentity: setUserIdentity,
  getUserIdentity: getUserIdentity,
  init: init,
  unload: unload,
}
