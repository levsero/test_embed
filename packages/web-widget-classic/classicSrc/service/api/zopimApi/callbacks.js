import { isFeatureEnabled } from '@zendesk/widget-shared-services'

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
  if (isFeatureEnabled('chat_flush_queue_order')) {
    chatConnected = true
  }

  flushQueue(onChatConnectedQueue)
  onChatConnectedQueue = []
  chatConnected = true
}

export const handleChatSDKInitialized = () => {
  if (isFeatureEnabled('chat_flush_queue_order')) {
    chatSDKInitialized = true
  }
  flushQueue(onChatSDKInitializedQueue)
  onChatSDKInitializedQueue = []
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
}
