import { getEmbeddableConfig } from 'src/redux/modules/base/base-selectors'

const getState = state => state.chat

export const getIsPollingChat = state =>
  !getEmbeddableConfig(state).disableStatusPolling && getState(state).deferredChatIsPolling
