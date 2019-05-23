let chatConnected = false;
let chatSDKInitialized = false;

const onChatConnectedQueue = [];
const onChatSDKInitializedQueue = [];

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

const flushQueue = (queue) => {
  queue.forEach(cb => cb());
  queue.length = 0;
};
