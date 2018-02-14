import _ from 'lodash';
import { createSelector } from 'reselect';

const groupChatsByAgent = (state) => {
  const agentMsgs = getChatMessagesByAgent(state);

  return _.groupBy(agentMsgs, (chat) => chat.nick);
};
const getChats = (state) => state.chat.chats;

export const getNotification = (state) => state.chat.notification;
export const getNotificationCount = (state) => getNotification(state).count;
export const getPrechatFormSettings = (state) => state.chat.accountSettings.prechatForm;
export const getPostchatFormSettings = (state) => state.chat.accountSettings.postchatForm;
export const getConciergeSettings = (state) => state.chat.accountSettings.concierge;
export const getAgents = (state) => state.chat.agents;
export const getConnection = (state) => state.chat.connection;
export const getUserSoundSettings = (state) => state.chat.userSettings.sound;
export const getChatStatus = (state) => state.chat.account_status;
export const getIsChatting = (state) => state.chat.is_chatting;
export const getChatVisitor = (state) => state.chat.visitor;
export const getChatOnline = (state) => _.includes(['online', 'away'], getChatStatus(state));
export const getChatScreen = (state) => state.chat.screen;
export const getCurrentMessage = (state) => state.chat.currentMessage;
export const getChatRating = (state) => state.chat.rating;
export const getAttachmentsEnabled = (state) => state.chat.accountSettings.attachments.enabled;
export const getRatingSettings = (state) => state.chat.accountSettings.rating;
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
    const filterChatType = (event) => _.includes(['chat.msg', 'chat.file'], event.type);

    return _.filter([...chats.values()], filterChatType);
export const getChatMessagesByAgent = createSelector(
  [getChatMessages],
  }
);
  (chats) => {
    return _.filter(chats, (chat) => _.includes(chat.nick, 'agent'));
  }
);
