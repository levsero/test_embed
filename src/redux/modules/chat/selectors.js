import _ from 'lodash';
import { createSelector } from 'reselect';

const getNotification = (state) => state.chat.notification;
const getAgents = (state) => state.chat.agents;
const getChats = (state) => {
  return _.filter([...state.chat.chats.values()], (e) => e.type === 'chat.msg');
};
const getChatsByAgent = (state) => {
  const chats = _.filter(getChats(state), (chat) => _.includes(chat.nick, 'agent'));

  return _.groupBy(chats, (chat) => chat.nick);
};
const getPrechatSettings = (state) => state.chat.accountSettings.prechatForm;

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

export const getPrechatFormFields = createSelector(
  [getPrechatSettings],
  (prechatSettings) => {
    const { form } = prechatSettings;

    return _.keyBy(_.values(form), 'name');
  }
);
