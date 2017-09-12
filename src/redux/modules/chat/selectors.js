import { createSelector } from 'reselect';

const getNotification = (state) => state.chat.notification;
const getAgents = (state) => state.chat.agents;

export const getChatNotification = createSelector(
  [getNotification, getAgents],
  (notification, agents) => {
    return { ...notification, ...agents[notification.nick] };
  }
);
