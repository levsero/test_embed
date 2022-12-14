import _ from 'lodash'
import createCachedSelector from 're-reselect'
import { createSelector } from 'reselect'

const getHistory = (state) => state.chat.chatHistory.chats

export const getHistoryLog = (state) => state.chat.chatHistory.log.entries
export const getHasChatHistory = (state) => getHistoryLength(state) > 0
export const getHasMoreHistory = (state) => state.chat.chatHistory.hasMore
export const getHistoryRequestStatus = (state) => state.chat.chatHistory.requestStatus

export const getHistoryLength = createSelector([getHistory], (history) =>
  history ? history.size : 0
)

export const getGroupMessages = createCachedSelector(
  getHistory,
  (state, messageKeys) => messageKeys,
  (history, messageKeys) => _.map(messageKeys, (key) => history.get(key))
)((state, messageKeys) => messageKeys[messageKeys.length - 1])
