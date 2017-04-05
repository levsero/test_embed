import _ from 'lodash';

import { document } from 'utility/globals';

let previousEvent = null;
const listeners = [];
const defaultTargetOptions = {
  speedThreshold: 1.5,
  fastMinDistance: 0.6,
  slowMinDistance: 0.25
};

const target = (element, onHit, options) => {
  options = _.defaults({}, options, defaultTargetOptions);

  let previousDistance = 0;
  const cancelHandler = (listener) => () => removeListener(listener);
  const listener = (props) => {
    const { x, y, speed } = props;
    const bounds = element.getBoundingClientRect();

    // Get the positions in normalized coordinates to make the distance check
    // more simple for different window sizes.
    const [targetNormX, targetNormY] = normaliseCoords(bounds.left, bounds.top);
    const [mouseNormX, mouseNormY] = normaliseCoords(x, y);

    if (__DEV__) {
      drawDebugLine(targetNormX, targetNormY, mouseNormX, mouseNormY);
    }

    // Check the euclidean distance between the mouse and the widget.
    const distance = getDistance(targetNormX, targetNormY, mouseNormX, mouseNormY);
    const minDistance = speed > options.speedThreshold
                      ? options.fastMinDistance
                      : options.slowMinDistance;

    if (distance < minDistance && previousDistance > distance) {
      onHit();
      cancelHandler(listener)();
    }

    previousDistance = distance;
  };

  addListener(listener);

  // Return a handler to the calling code so this event can be cancelled.
  return cancelHandler(listener);
};

function addListener(listener) {
  if (listeners.length === 0) {
    document.addEventListener('mousemove', handleMouseMove);
  }

  listeners.push(listener);
}

function removeListener(listener) {
  _.pull(listeners, listener);

  if (listeners.length === 0) {
    document.removeEventListener('mousemove', handleMouseMove);
  }
}

function handleMouseMove(event) {
  event.time = Date.now();

  const { clientX: x, clientY: y } = event;
  const speed = calculateMouseSpeed(x, y);
  const props = {
    x,
    y,
    speed,
    event
  };

  previousEvent = event;
  listeners.forEach((listener) => listener(props));
}

function calculateMouseSpeed(x, y) {
  if (!previousEvent) {
    return 0;
  }

  const { clientX: lastX, clientY: lastY } = previousEvent;
  const distance = getDistance(lastX, lastY, x, y);
  const time = Date.now() - previousEvent.time;

  return distance / time;
}

function getDistance(x1, y1, x2, y2) {
  const lhs = Math.pow(x1 - x2, 2);
  const rhs = Math.pow(y1 - y2, 2);

  return Math.sqrt(lhs + rhs);
}

function normaliseCoords(x, y) {
  const docEl = document.documentElement;

  return [
    x / docEl.clientWidth,
    y / docEl.clientHeight
  ];
}

function drawDebugLine(targetX, targetY, mouseX, mouseY) {
  const line = document.getElementById('zeLine');

  if (!line) {
    return;
  }

  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;

  line.setAttribute('x1', Math.round(mouseX * clientWidth));
  line.setAttribute('x2', Math.round(targetX * clientWidth));
  line.setAttribute('y1', Math.round(mouseY * clientHeight));
  line.setAttribute('y2', Math.round(targetY * clientHeight));
}

export const mouse = {
  target,
  addListener,
  removeListener,
  // The event handlers are exposed because we can't simulate mouse events in our tests.
  handleMouseMove
};
