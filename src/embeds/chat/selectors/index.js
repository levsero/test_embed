const getState = state => state.chat

export const getIsPollingChat = state => getState(state).deferredChatIsPolling
