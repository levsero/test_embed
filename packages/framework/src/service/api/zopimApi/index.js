import { setupZopimQueue, handleZopimQueue } from './queues'
import { handleChatSDKInitialized, handleChatConnected } from './callbacks'
import { setUpZopimApiMethods } from './setup'

const zopimApi = {
  setupZopimQueue,
  handleZopimQueue,
  setUpZopimApiMethods,
  handleChatSDKInitialized,
  handleChatConnected,
}

export default zopimApi
