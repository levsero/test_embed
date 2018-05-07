import { createSelector } from 'reselect';
import _ from 'lodash';

import { CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat';

const getPastChats = state => state.chat.chatHistory.chats;

const isMessage = entry => _.includes(CHAT_MESSAGE_EVENTS, entry.type);
const isEvent = entry => _.includes(CHAT_SYSTEM_EVENTS, entry.type);

const getPastChatsBySession = createSelector(
  [getPastChats],
  (chatsMap) => {
    const chatsArr = [...chatsMap.values()];
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

export const getHasMoreHistory = state => state.chat.chatHistory.hasMore;
export const getHistoryRequestStatus = state => state.chat.chatHistory.requestStatus;

export const getGroupedPastChatsBySession = createSelector(
  [getPastChatsBySession],
  pastSessions => _.map(pastSessions, session => getGroupedChat(session))
);
