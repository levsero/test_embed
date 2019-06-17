let chatConnected = false;
let chatSDKInitialized = false;

let onChatConnectedQueue = [];
let onChatSDKInitializedQueue = [];

export const onChatConnected = (cb) => {
  if (chatConnected) {
    cb();
  } else {
    onChatConnectedQueue.push(cb);
  }
};

export const onChatSDKInitialized = (cb) => {
  if (chatSDKInitialized) {
    cb();
  } else {
    onChatSDKInitializedQueue.push(cb);
  }
};

export const handleChatConnected = () => {
  flushQueue(onChatConnectedQueue);
  chatConnected = true;
};

export const handleChatSDKInitialized = () => {
  flushQueue(onChatSDKInitializedQueue);
  chatSDKInitialized = true;
};

// Used solely for testing purposes.
export const reset = () => {
  chatConnected = false;
  chatSDKInitialized = false;
  onChatConnectedQueue = [];
  onChatSDKInitializedQueue = [];
};

const flushQueue = (queue) => {
  queue.forEach(cb => cb());
  queue = [];
};
