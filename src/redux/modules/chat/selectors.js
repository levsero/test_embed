import _ from 'lodash';
import { createSelector } from 'reselect';

const getNotification = (state) => state.chat.notification;
const getAgents = (state) => state.chat.agents;
const getChats = (state) => {
  return [...state.chat.chats._c.values()].filter((e) => e.type === 'chat.msg');
};
const getChatsByAgent = (state) => {
  const chats = getChats(state).filter((chat) => _.includes(chat.nick, 'agent'));

  return _.groupBy(chats, (chat) => chat.nick);
};

export const getChatNotification = createSelector(
  [getNotification, getAgents, getChatsByAgent],
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
