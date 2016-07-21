import _ from 'lodash';

import { document } from 'utility/globals';

let listeners = {};
let lastPosition = { x: -1, y: -1 };
let lastEvent = null;
const eventMap = {
  'mousemove': handleMouseMove
};

function addListener(eventType, listener, key) {
  if (!eventMap.hasOwnProperty(eventType)) {
    return;
  }

  if (_.isEmpty(listeners)) {
    document.addEventListener(eventType, eventMap[eventType]);
  }

  listeners[key] = listener;
}

function removeListener(eventType, key) {
  if (!eventMap.hasOwnProperty(eventType)) {
    return;
  }

  listeners = _.omit(listeners, key);

  if (_.isEmpty(listeners)) {
    document.removeEventListener(eventType, eventMap[eventType]);
  }
}

function handleMouseMove(event) {
  event.time = Date.now();

  const position = { x: event.clientX, y: event.clientY };
  const speed = calculateMouseSpeed(position);

  lastEvent = event;

  _.forEach(listeners, (l) => l({
    position,
    speed,
    event
  }));

  _.merge(lastPosition, position);
}

function calculateMouseSpeed(position) {
  if (!lastEvent) {
    return 0;
  }

  const distX = lastEvent.clientX - position.x;
  const distY = lastEvent.clientY - position.y;
  const distance = Math.sqrt(distX*distX + distY*distY);
  const time = Date.now() - lastEvent.time;

  return distance / time;
}

export const mouse = {
  addListener,
  removeListener
};
