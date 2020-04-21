import { getEmbeddableConfig } from 'src/redux/modules/base/base-selectors'

const getState = state => state.chat

export const getIsPollingChat = state =>
  !getEmbeddableConfig(state).disableStatusPolling && getState(state).deferredChatIsPolling

export const getDeferredChatHasResponse = state => getState(state).deferredChatHasResponse

export const getVisitorEmail = state => getState(state).visitor.email

export const getMenuVisible = state => getState(state).menuVisible

export const getUserSoundSettings = state => getState(state).soundEnabled

export const getContactDetailsSubmissionPending = state =>
  getState(state).contactDetailsSubmissionPending

export const getContactDetailsSubmissionError = state =>
  getState(state).contactDetailsSubmissionError

export const getEditContactDetails = state => getState(state).editContactDetails

export const getShowEditContactDetails = state => getEditContactDetails(state).show
