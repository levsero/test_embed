import { createSelector } from 'reselect';
import _ from 'lodash';

import { CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat';

const getHistory = state => state.chat.chatHistory;
const getPastChats = state => getHistory(state).chats;

const getSortedArrayFromMap = map => [...map.values()].sort((a, b) => a.timestamp - b.timestamp);
const isMessage = entry => _.includes(CHAT_MESSAGE_EVENTS, entry.type);
const isEvent = entry => _.includes(CHAT_SYSTEM_EVENTS, entry.type);

export const getHasMoreHistory = createSelector(
  [getHistory],
  history => history.hasMore
);

const getPastChatsBySession = createSelector(
  [getPastChats],
  (chatsMap) => {
    const chatsArr = getSortedArrayFromMap(chatsMap);
    let session = [];

    return _.reduce(chatsArr, (pastSessions, chat, idx) => {
      if (chat.first) {
        session.length && pastSessions.push(session);
        session = [chat];
      } else {
        session.push(chat);
      }

      if (idx === chatsArr.length - 1) {
        pastSessions.push(session);
      }

      return pastSessions;
    }, []);
  }
);

const getGroupedChat = chatsArr => {
  let lastUniqueEntry;

  const getGroupTimestamp = entry => {
    if (isEvent(entry)) {
      lastUniqueEntry = entry;
    }
    else if (
      !lastUniqueEntry ||
      !isMessage(lastUniqueEntry) ||
      lastUniqueEntry.nick !== entry.nick
    ) {
      lastUniqueEntry = entry;
    }

    return lastUniqueEntry.timestamp;
  };

  return _.reduce(chatsArr, (groupedChat, entry) => {
    const groupTimestamp = getGroupTimestamp(entry);

    if (groupedChat[groupTimestamp]) {
      groupedChat[groupTimestamp].push(entry);
    }
    else {
      groupedChat[groupTimestamp] = [entry];
    }

    return groupedChat;
  }, {});
};

export const getGroupedPastChatsBySession = createSelector(
  [getPastChatsBySession],
  pastSessions => _.map(pastSessions, session => getGroupedChat(session))
);

export const getHistoryRequestStatus = createSelector(
  [getHistory],
  history => history.requestStatus
);
