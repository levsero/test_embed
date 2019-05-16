import _ from 'lodash';

import {
  WIDGET_OPENED_EVENT,
  WIDGET_CLOSED_EVENT,
  CHAT_CONNECTED_EVENT,
  CHAT_ENDED_EVENT,
  CHAT_STARTED_EVENT,
  CHAT_STATUS_EVENT,
  CHAT_UNREAD_MESSAGES_EVENT,
  CHAT_DEPARTMENT_STATUS_EVENT
} from 'constants/event';

const callbacksRegistry = {
  [WIDGET_OPENED_EVENT]: [],
  [WIDGET_CLOSED_EVENT]: [],
  [CHAT_CONNECTED_EVENT]: [],
  [CHAT_ENDED_EVENT]: [],
  [CHAT_STARTED_EVENT]: [],
  [CHAT_DEPARTMENT_STATUS_EVENT]: [],
  [CHAT_UNREAD_MESSAGES_EVENT]: [],
  [CHAT_STATUS_EVENT]: []
};

const eventExists = (eventName) => _.has(callbacksRegistry, eventName);

export const registerCallback = (cb, eventName) => {
  if (!eventExists(eventName)) return;

  callbacksRegistry[eventName].push(cb);
};

export const fireEventsFor = (eventName, args = []) => {
  if (!eventExists(eventName)) return;

  callbacksRegistry[eventName].forEach(cb => _.isFunction(cb) ? cb(...args) : null);
};
