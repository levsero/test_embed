import _ from 'lodash';

import { document } from 'utility/globals';

let previousEvent = null;
let element = null;
let onHitHandler = () => {};

const maxSpeed = 5;
const minHitDistance = 0.25;
const maxHitDistance = 0.6;

const mouse = {
  target(domElement, onHit) {
    if (element) return;

    element = domElement;
    onHitHandler = onHit;
    addListener();

    // Return a handler to the calling code so this event can be cancelled.
    return () => removeListener();
  },

  hasTargetHit(distance, speed, isMovingTowards) {
    // Calculate what the minimum distance should be based on the current mouse speed.
    const cappedSpeed = Math.min(speed, maxSpeed);
    const threshold = _.clamp(cappedSpeed / maxSpeed, minHitDistance, maxHitDistance);

    return distance < threshold && isMovingTowards;
  }
};

const addListener = () => {
  document.addEventListener('mousemove', handleMouseMove);
};

const removeListener = () => {
  document.removeEventListener('mousemove', handleMouseMove);
};

const handleMouseMove = (event) => {
  event.time = Date.now();

  const { x, y, vx, vy, speed } = getMouseProperties(event);
  const [targetX, targetY] = getTargetPosition(element);

  // Get the positions & velocity in normalised (0..1) form to make the distance check
  // more simple for different window sizes.
  const targetPosNorm = normalise(targetX, targetY);
  const mousePosNorm = normalise(x, y);
  const mouseVelNorm = normalise(vx, vy);

  // Get the euclidean distance between the mouse and the widget.
  const distance = getDistanceFromTarget(targetPosNorm, mousePosNorm);
  const movingTowards = isMovingTowards(targetPosNorm, mousePosNorm, mouseVelNorm);

  if (__DEV__) {
    drawDebugLine(targetPosNorm, mousePosNorm);
  }

  previousEvent = event;
  if (hasTargetHit(distance, speed, movingTowards)) {
    onHitHandler();
    removeListener();
  }
};

const getMouseProperties = (event) => {
  const { clientX: x, clientY: y } = event;
  const now = Date.now();
  const speed = getMouseSpeed(x, y, now);
  const [vx, vy] = getMouseVelocity(x, y, now);

  return {
    x,
    y,
    vx,
    vy,
    speed,
    event
  };
};

const getDistanceFromTarget = (targetPosNorm, mousePosNorm) => {
  const [targetNormX, targetNormY] = targetPosNorm;
  const [mouseNormX, mouseNormY] = mousePosNorm;

  return getDistance(targetNormX, targetNormY, mouseNormX, mouseNormY);
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

const getTargetPosition = (target) => {
  const { clientWidth: w, clientHeight: h } = document.documentElement;
  const { left, right, top, bottom } = target.getBoundingClientRect();

  return [
    left > w/2 ? left : right,
    top > h/2 ? top : bottom
  ];
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
  // Exported for easier testing.
  hasTargetHit,
  // The window event handler is exposed because we can't simulate mouse events in our tests.
  handleMouseMove
};
