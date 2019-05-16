import _ from 'lodash';

import {
  API_ON_OPEN_NAME,
  API_ON_CLOSE_NAME,
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_DEPARTMENT_STATUS,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_ON_CHAT_STATUS_NAME
} from 'constants/api';

const callbacksRegistry = {
  [API_ON_OPEN_NAME]: [],
  [API_ON_CLOSE_NAME]: [],
  [API_ON_CHAT_CONNECTED_NAME]: [],
  [API_ON_CHAT_END_NAME]: [],
  [API_ON_CHAT_START_NAME]: [],
  [API_ON_CHAT_DEPARTMENT_STATUS]: [],
  [API_ON_CHAT_UNREAD_MESSAGES_NAME]: [],
  [API_ON_CHAT_STATUS_NAME]: []
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
