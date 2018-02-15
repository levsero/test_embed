import _ from 'lodash';
import { createSelector } from 'reselect';

export const CHAT_MESSAGE_EVENTS = [
  'chat.msg',
  'chat.file'
];

export const CHAT_SYSTEM_EVENTS = [
  'chat.memberjoin',
  'chat.memberleave',
  'chat.rating'
];

const groupChatsByAgent = (state) => {
  const agentMsgs = getChatMessagesByAgent(state);

  return _.groupBy(agentMsgs, (chat) => chat.nick);
};

const getChats = (state) => state.chat.chats;
const getNotification = (state) => state.chat.notification;

export const getAgents = (state) => state.chat.agents;
export const getConciergeSettings = (state) => state.chat.accountSettings.concierge;
export const getConnection = (state) => state.chat.connection;
export const getCurrentMessage = (state) => state.chat.currentMessage;
export const getChatOnline = (state) => _.includes(['online', 'away'], getChatStatus(state));
export const getChatRating = (state) => state.chat.rating;
export const getChatScreen = (state) => state.chat.screen;
export const getChatStatus = (state) => state.chat.account_status;
export const getChatVisitor = (state) => state.chat.visitor;
export const getIsChatting = (state) => state.chat.is_chatting;
export const getNotificationCount = (state) => getNotification(state).count;
export const getPostchatFormSettings = (state) => state.chat.accountSettings.postchatForm;
export const getPrechatFormSettings = (state) => state.chat.accountSettings.prechatForm;
export const getEmailTranscript = (state) => state.chat.emailTranscript;
export const getAttachmentsEnabled = (state) => state.chat.accountSettings.attachments.enabled;
export const getRatingSettings = (state) => state.chat.accountSettings.rating;
export const getUserSoundSettings = (state) => state.chat.userSettings.sound;

export const getChatNotification = createSelector(
  [getNotification, getAgents, groupChatsByAgent],
  (notification, agents, chats) => {
    const { nick } = notification;
    const agentChats = chats[nick];
    const proactive = !!(agentChats && agentChats.length === 1);

    return {
      ...notification,
      ...agents[notification.nick],
      proactive
    };
  }
);

export const getPrechatFormFields = createSelector(
  [getPrechatFormSettings],
  (prechatSettings) => {
    const { form } = prechatSettings;

    return _.keyBy(_.values(form), 'name');
  }
);

export const getChatMessages = createSelector(
  [getChats],
  (chats) => {
    const chatsArr = Array.from(chats.values());

    return _.filter((chatsArr),
      (chat) =>
        _.includes(CHAT_MESSAGE_EVENTS, chat.type)
    );
  }
);

export const getChatMessagesByAgent = createSelector(
  [getChatMessages],
  (messages) => {
    return _.filter(messages, (message) => _.includes(message.nick, 'agent'));
  }
);

export const getChatEvents = createSelector(
  [getChats],
  (chats) => {
    const chatsArr = Array.from(chats.values());

    return _.filter((chatsArr),
      (chat) =>
        _.includes(CHAT_SYSTEM_EVENTS, chat.type)
    );
  }
);

export const getGroupedChatLog = createSelector(
  [getChats],
  (chats) => {
    const chatsArr = Array.from(chats.values());
    let previousMessageOrEvent;

    const isMessage = (messageOrEvent) => {
      return _.includes(CHAT_MESSAGE_EVENTS, messageOrEvent.type);
    };

    const isEvent = (messageOrEvent) => {
      return _.includes(CHAT_SYSTEM_EVENTS, messageOrEvent.type);
    };

    const getGroupTimestamp = (messageOrEvent, previousMessageOrEvent) => {
      if (isEvent(messageOrEvent)) {
        return messageOrEvent.timestamp;
      }

      if (isMessage(messageOrEvent)) {
        if (previousMessageOrEvent && isMessage(previousMessageOrEvent)) {
          if (previousMessageOrEvent.nick === messageOrEvent.nick) {
            return previousMessageOrEvent.timestamp;
          }
        }
        return messageOrEvent.timestamp;
      }

      return null;
    };

    return _.reduce(chatsArr, (groupedChatLog, messageOrEvent) => {
      if (!messageOrEvent) { return groupedChatLog; }

      const groupTimestamp = getGroupTimestamp(messageOrEvent, previousMessageOrEvent);

      if (groupTimestamp) {
        (groupedChatLog[groupTimestamp] || (groupedChatLog[groupTimestamp] = [])).push(messageOrEvent);
      }

      previousMessageOrEvent = messageOrEvent;

      return groupedChatLog;
    }, {});
  }
);
