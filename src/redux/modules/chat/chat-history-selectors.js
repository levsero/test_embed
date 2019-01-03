import _ from 'lodash';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

const getHistory = state => state.chat.chatHistory.chats;

export const getHistoryLog = state => state.chat.chatHistory.log.entries;
export const getHasMoreHistory = state => state.chat.chatHistory.hasMore;
export const getHistoryRequestStatus = state => state.chat.chatHistory.requestStatus;

export const getHistoryLength = createSelector(
  [getHistory],
  history => history.size
);

export const getGroupMessages = createCachedSelector(
  getHistory,
  (state, messageKeys) => messageKeys,
  (history, messageKeys) => _.map(messageKeys, (key) => history.get(key))
)(
  (state, messageKeys) => messageKeys[messageKeys.length - 1]
);
