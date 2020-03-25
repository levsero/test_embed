import { getEmbeddableConfig } from 'src/redux/modules/base/base-selectors'

const getState = state => state.chat

export const getIsPollingChat = state =>
  !getEmbeddableConfig(state).disableStatusPolling && getState(state).deferredChatIsPolling

export const getDeferredChatHasResponse = state => getState(state).deferredChatHasResponse

export const getMenuVisible = state => getState(state).menuVisible

export const getUserSoundSettings = state => getState(state).soundEnabled
