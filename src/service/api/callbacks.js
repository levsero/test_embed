import _ from 'lodash';

import { API_ON_OPEN_NAME, API_ON_CLOSE_NAME } from 'constants/api';

const callbacksRegistry = {
  [API_ON_OPEN_NAME]: [],
  [API_ON_CLOSE_NAME]: []
};

const eventExists = (eventName) => _.has(callbacksRegistry, eventName);

export const registerCallback = (cb, eventName) => {
  if (!eventExists(eventName)) return;

  callbacksRegistry[eventName].push(cb);
};

export const fireEventsFor = (eventName) => {
  if (!eventExists(eventName)) return;

  callbacksRegistry[eventName].forEach(cb => _.isFunction(cb) ? cb() : null);
};
