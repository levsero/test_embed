import _ from 'lodash';

import { document } from 'utility/globals';

let previousEvent = null;
const listeners = [];
const maxSpeed = 5;
const minDistanceThreshold = 0.25;
const maxDistanceThreshold = 0.6;

const target = (element, onHit) => {
  const cancelHandler = (listener) => () => removeListener(listener);
  const listener = (props) => {
    const { x, y, vx, vy, speed } = props;
    const bounds = element.getBoundingClientRect();

    // Get the positions & velocity in normalised (0..1) form to make the distance check
    // more simple for different window sizes.
    const targetPosNorm = normalise(bounds.left, bounds.top);
    const mousePosNorm = normalise(x, y);
    const mouseVelNorm = normalise(vx, vy);

    if (__DEV__) {
      drawDebugLine(targetPosNorm, mousePosNorm);
    }

    // Check the euclidean distance between the mouse and the widget.
    const [targetX, targetY] = targetPosNorm;
    const [mouseX, mouseY] = mousePosNorm;
    const distance = getDistance(targetX, targetY, mouseX, mouseY);

    // Calculate what the minimum distance should be based on the current mouse speed.
    const cappedSpeed = Math.min(speed, maxSpeed);
    const minDistance = Math.min(Math.max(minDistanceThreshold, cappedSpeed / maxSpeed), maxDistanceThreshold);

    if (distance < minDistance &&
        isMovingTowards(targetPosNorm, mousePosNorm, mouseVelNorm)) {
      onHit();
      cancelHandler(listener)();
    }
  };

  addListener(listener);

  // Return a handler to the calling code so this event can be cancelled.
  return cancelHandler(listener);
};

const addListener = (listener) => {
  if (listeners.length === 0) {
    document.addEventListener('mousemove', handleMouseMove);
  }

  listeners.push(listener);
};

const removeListener = (listener) => {
  _.pull(listeners, listener);

  if (listeners.length === 0) {
    document.removeEventListener('mousemove', handleMouseMove);
  }
};

const handleMouseMove = (event) => {
  event.time = Date.now();

  const { clientX: x, clientY: y } = event;
  const now = Date.now();
  const speed = getMouseSpeed(x, y, now);
  const [vx, vy] = getMouseVelocity(x, y, now);
  const props = {
    x,
    y,
    vx,
    vy,
    speed,
    event
  };

  previousEvent = event;
  listeners.forEach((listener) => listener(props));
};

const getMouseSpeed = (x, y, now) => {
  if (!previousEvent) {
    return 0;
  }

  const { clientX: lastX, clientY: lastY } = previousEvent;
  const distance = getDistance(lastX, lastY, x, y);
  const time = now - previousEvent.time;

  return distance / time;
};

const getMouseVelocity = (x, y, now) => {
  if (!previousEvent) {
    return [0, 0];
  }

  const { clientX: lastX, clientY: lastY } = previousEvent;
  const time = now - previousEvent.time;

  return [
    (x - lastX) / time,
    (y - lastY) / time
  ];
};

const getDistance = (x1, y1, x2, y2) => {
  const lhs = Math.pow(x2 - x1, 2);
  const rhs = Math.pow(y2 - y1, 2);

  return Math.sqrt(lhs + rhs);
};

const normalise = (x, y) => {
  const docEl = document.documentElement;

  return [
    x / docEl.clientWidth,
    y / docEl.clientHeight
  ];
};

const isMovingTowards = (target, position, velocity) => {
  const dx = target[0] - position[0];
  const dy = target[1] - position[1];

  return dotProduct(dx, dy, velocity[0], velocity[1]) > 0;
};

const dotProduct = (ax, ay, bx, by) => {
  return ax*bx + ay*by;
};

const drawDebugLine = (target, mouse) => {
  const line = document.getElementById('zeLine');

  if (!line) {
    return;
  }

  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;

  line.setAttribute('x1', Math.round(mouse[0] * clientWidth));
  line.setAttribute('x2', Math.round(target[0] * clientWidth));
  line.setAttribute('y1', Math.round(mouse[1] * clientHeight));
  line.setAttribute('y2', Math.round(target[1] * clientHeight));
};

export const mouse = {
  target,
  addListener,
  removeListener,
  // The event handlers are exposed because we can't simulate mouse events in our tests.
  handleMouseMove
};
