import _ from 'lodash';

import { document } from 'utility/globals';

let previousEvent = null;

// TODO: Add more browser events.
const eventNameMap = {
  'move': 'mousemove'
};
const eventHandlerMap = {
  'mousemove': handleMouseMove
};
const listenersStore = _.reduce(eventHandlerMap, (res, _, key) => {
  res[key] = [];
  return res;
}, {});
const defaultTargetOptions = {
  speedThreshold: 1.5,
  fastMinDistance: 0.6,
  slowMinDistance: 0.25
};

function on(event, listener) {
  const listeners = getListeners(event);

  if (listeners === null) {
    return;
  }

  if (listeners.length === 0) {
    const eventName = eventNameMap[event];

    document.addEventListener(eventName, eventHandlerMap[eventName]);
  }

  listeners.push(listener);
}

function once(event, listener) {
  listener.once = true;
  on(event, listener);
}

function off(event, listener) {
  let listeners = getListeners(event);

  if (listeners === null) {
    return;
  }

  const idx = listeners.indexOf(listener);

  if (idx > -1) {
    listeners = listeners.splice(idx, 1);
  }

  if (listeners.length === 0) {
    const eventName = eventNameMap[event];

    document.removeEventListener(eventName, eventHandlerMap[eventName]);
  }
}

function target(element, onHit, options = {}) {
  _.defaults(options, defaultTargetOptions);

  let previousDistance = 0;
  const listener = (props) => {
    const bounds = element.getBoundingClientRect();

    // Get the positions in normalized coordinates to make the distance check
    // more simple for different window sizes.
    const targetCoords = normaliseCoords(bounds.left, bounds.top);
    const mouseCoords = normaliseCoords(props.x, props.y);

    if (__DEV__) {
      drawDebugLine(targetCoords, mouseCoords);
    }

    // Check the euclidean distance between the mouse and the widget.
    const distance = getDistance(targetCoords, mouseCoords);
    const minDistance = props.speed > options.speedThreshold
                      ? options.fastMinDistance
                      : options.slowMinDistance;

    if (distance < minDistance && previousDistance > distance) {
      onHit();
      off('move', listener);
    }

    previousDistance = distance;
  };
  const cancel = () => {
    off('move', listener);
  };

  on('move', listener);

  // Return a handler to the calling code so this event can be cancelled.
  return cancel;
}

function getListeners(event) {
  const eventName = eventNameMap[event];

  return eventHandlerMap[eventName]
       ? listenersStore[eventName]
       : null;
}

function remove(event) {
  const listeners = getListeners(event);

  if (listeners === null) {
    return;
  }

  const eventName = eventNameMap[event];

  listenersStore[eventName] = [];
  document.removeEventListener(eventName, eventHandlerMap[eventName]);
}

function handleMouseMove(event) {
  event.time = Date.now();

  const position = { x: event.clientX, y: event.clientY };
  const speed = calculateMouseSpeed(position);
  const listeners = listenersStore.mousemove;

  previousEvent = event;

  callListeners(listeners, {
    x: position.x,
    y: position.y,
    speed,
    event
  });
}

function callListeners(listeners, props) {
  _.forEach(listeners, (listener) => {
    listener(props);

    if (listener.once) {
      off(event, listener);
    }
  });
}

function calculateMouseSpeed(position) {
  if (!previousEvent) {
    return 0;
  }

  const lastPos = { x: previousEvent.clientX, y: previousEvent.clientY };
  const distance = getDistance(lastPos, position);
  const time = Date.now() - previousEvent.time;

  return distance / time;
}

function getDistance(pointA, pointB) {
  const lhs = Math.pow(pointA.x - pointB.x, 2);
  const rhs = Math.pow(pointA.y - pointB.y, 2);

  return Math.sqrt(lhs + rhs);
}

function normaliseCoords(x, y) {
  const docEl = document.documentElement;

  return {
    x: x / docEl.clientWidth,
    y: y / docEl.clientHeight
  };
}

function drawDebugLine(widgetCoords, mouseCoords) {
  const line = document.getElementById('zeLine');

  if (!line) {
    return;
  }

  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;

  line.setAttribute('x1', Math.round(mouseCoords.x * clientWidth));
  line.setAttribute('x2', Math.round(widgetCoords.x * clientWidth));
  line.setAttribute('y1', Math.round(mouseCoords.y * clientHeight));
  line.setAttribute('y2', Math.round(widgetCoords.y * clientHeight));
}

export const mouse = {
  on,
  once,
  off,
  remove,
  target,
  getListeners,
  // The event handlers are exposed because we can't simulate mouse events in our tests.
  handleMouseMove
};
