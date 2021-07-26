import { handleChatSDKInitialized, handleChatConnected } from './callbacks'
import { setupZopimQueue, handleZopimQueue } from './queues'
import { setUpZopimApiMethods } from './setup'

const zopimApi = {
  setupZopimQueue,
  handleZopimQueue,
  setUpZopimApiMethods,
  handleChatSDKInitialized,
  handleChatConnected,
}

export default zopimApi
