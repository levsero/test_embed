import _ from 'lodash';
import { createSelector } from 'reselect';

const getNotification = (state) => state.chat.notification;
const getChats = (state) => {
  return _.filter([...state.chat.chats.values()], (e) => e.type === 'chat.msg');
};
const groupChatsByAgent = (state) => {
  const agentMsgs = getChatsByAgent(state);

  return _.groupBy(agentMsgs, (chat) => chat.nick);
};
const getPrechatSettings = (state) => state.chat.accountSettings.prechatForm;

export const getPostchatFormSettings = (state) => state.chat.accountSettings.postchatForm;
export const getAgents = (state) => state.chat.agents;
export const getConnection = (state) => state.chat.connection;
export const getUserSoundSettings = (state) => state.chat.userSettings.sound;
export const getChatStatus = (state) => state.chat.account_status;
export const getIsChatting = (state) => state.chat.is_chatting;
export const getChatVisitor = (state) => state.chat.visitor;
export const getChatsByAgent = (state) => {
  return _.filter(getChats(state), (chat) => _.includes(chat.nick, 'agent'));
};

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
  [getPrechatSettings],
  (prechatSettings) => {
    const { form } = prechatSettings;

    return _.keyBy(_.values(form), 'name');
  }
);
