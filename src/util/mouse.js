import _ from 'lodash';

import { document } from 'utility/globals';
import { getDistance } from 'utility/utils';

let listeners = {};
let lastPosition = { x: -1, y: -1 };
let lastEvent = null;
const eventMap = {
  'onmousemove': handleMouseMove,
  'onmousedown': handleMouseDown
};

function addListener(eventType, listener, key) {
  if (!eventMap.hasOwnProperty(eventType)) {
    return;
  }

  if (!listeners[eventType]) {
    document[eventType] = eventMap[eventType];
    listeners[eventType] = {};
  }

  listeners[eventType][key] = listener;
}

function getListener(eventType, key) {
  if (listeners[eventType]) {
    return listeners[eventType][key] || null;
  }

  return null;
}

function removeListener(eventType, key) {
  if (!eventMap.hasOwnProperty(eventType) ||
      !listeners.hasOwnProperty(eventType)) {
    return;
  }

  listeners[eventType] = _.omit(listeners[eventType], key);

  if (_.isEmpty(listeners[eventType])) {
    document[eventType] = null;
    listeners = _.omit(listeners, eventType);
  }
}

function removeAllListeners(eventType) {
  if (!eventMap.hasOwnProperty(eventType)) {
    return;
  }

  if (!_.isEmpty(listeners[eventType])) {
    listeners[eventType] = {};
    document[eventType] = null;
  }
}

function handleMouseMove(event) {
  event.time = Date.now();

  const position = { x: event.clientX, y: event.clientY };
  const speed = calculateMouseSpeed(position);
  const eventListeners = listeners.onmousemove;

  lastEvent = event;

  _.forEach(eventListeners, (l) => l({
    position,
    speed,
    event
  }));

  _.merge(lastPosition, position);
}

function handleMouseDown(event) {} // eslint-disable-line no-unused-vars

function calculateMouseSpeed(position) {
  if (!lastEvent) {
    return 0;
  }

  const lastPos = { x: lastEvent.clientX, y: lastEvent.clientY };
  const distance = getDistance(lastPos, position);
  const time = Date.now() - lastEvent.time;

  return distance / time;
}

export const mouse = {
  addListener,
  getListener,
  removeListener,
  removeAllListeners
};
