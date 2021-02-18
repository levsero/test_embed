import { getEmbeddableConfig } from 'src/redux/modules/base/base-selectors'
import createCachedSelector from 're-reselect'

const getHistory = (state) => state.chat.chatHistory.chats

const getState = (state) => state.chat

export const getIsPollingChat = (state) =>
  !getEmbeddableConfig(state).disableStatusPolling && getState(state).deferredChatIsPolling

export const getDeferredChatHasResponse = (state) => getState(state).deferredChatHasResponse

export const getVisitorEmail = (state) => getState(state).visitor.email

export const getMenuVisible = (state) => getState(state).menuVisible

export const getUserSoundSettings = (state) => getState(state).soundEnabled

export const getContactDetailsSubmissionPending = (state) =>
  getState(state).contactDetailsSubmissionPending

export const getContactDetailsSubmissionError = (state) =>
  getState(state).contactDetailsSubmissionError

export const getEditContactDetails = (state) => getState(state).editContactDetails

export const getShowEditContactDetails = (state) => getEditContactDetails(state).show

export const getChats = (state) => getState(state).chats

export const getHistoryEventMessage = createCachedSelector(
  getHistory,
  (state, messageKey) => messageKey,
  (history, messageKey) => history.get(messageKey)
)((state, messageKey) => messageKey)

export const getEventMessage = createCachedSelector(
  getChats,
  (_state, messageKey) => messageKey,
  (chats, messageKey) => chats.get(messageKey)
)((_state, messageKey) => messageKey)
