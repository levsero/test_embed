import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags'

let chatConnected = false
let chatSDKInitialized = false

let onChatConnectedQueue = []
let onChatSDKInitializedQueue = []

export const onChatConnected = (cb) => {
  if (chatConnected) {
    return cb()
  } else {
    onChatConnectedQueue.push(cb)
  }
}

export const onChatSDKInitialized = (cb) => {
  if (chatSDKInitialized) {
    return cb()
  } else {
    onChatSDKInitializedQueue.push(cb)
  }
}

export const handleChatConnected = () => {
  if (isFeatureEnabled(undefined, 'chat_flush_queue_order')) {
    chatConnected = true
  }

  flushQueue(onChatConnectedQueue)
  chatConnected = true
}

export const handleChatSDKInitialized = () => {
  if (isFeatureEnabled(undefined, 'chat_flush_queue_order')) {
    chatSDKInitialized = true
  }
  flushQueue(onChatSDKInitializedQueue)
  chatSDKInitialized = true
}

// Used solely for testing purposes.
export const reset = () => {
  chatConnected = false
  chatSDKInitialized = false
  onChatConnectedQueue = []
  onChatSDKInitializedQueue = []
}

const flushQueue = (queue) => {
  queue.forEach((cb) => cb())
  queue = []
}
