import _ from 'lodash';

import { document } from 'utility/globals';
import { getDistance } from 'utility/utils';

let listeners = {};
let previousEvent = null;
const eventMap = {
  'mousemove': handleMouseMove,
  'mousedown': handleMouseDown
};

function addListener(eventType, listener, key) {
  if (!eventMap.hasOwnProperty(eventType)) {
    return;
  }

  if (!listeners[eventType]) {
    document.addEventListener(eventType, eventMap[eventType]);
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
    listeners = _.omit(listeners, eventType);
    document.removeEventListener(eventType, eventMap[eventType]);
  }
}

function removeAllListeners(eventType) {
  if (!eventMap.hasOwnProperty(eventType)) {
    return;
  }

  if (!_.isEmpty(listeners[eventType])) {
    listeners[eventType] = {};
    document.removeEventListener(eventType, eventMap[eventType]);
  }
}

function handleMouseMove(event) {
  event.time = Date.now();

  const position = { x: event.clientX, y: event.clientY };
  const speed = calculateMouseSpeed(position);
  const eventListeners = listeners.mousemove;

  previousEvent = event;

  _.forEach(eventListeners, (listener) => listener({
    position,
    speed,
    event
  }));
}

function handleMouseDown(event) {} // eslint-disable-line no-unused-vars

function calculateMouseSpeed(position) {
  if (!previousEvent) {
    return 0;
  }

  const lastPos = { x: previousEvent.clientX, y: previousEvent.clientY };
  const distance = getDistance(lastPos, position);
  const time = Date.now() - previousEvent.time;

  return distance / time;
}

export const mouse = {
  addListener,
  getListener,
  removeListener,
  removeAllListeners,
  // The event handlers are exposed because we can't simulate mouse events in our tests.
  handleMouseMove
};
