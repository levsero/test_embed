import { document } from 'utility/globals';

let element = null;
let anchor = {};
let onHitHandler = () => {};

const HITBOX_SCALE = 2;

// This is a temporary module that will soon be deleted in favour of a widget on-click solution.
// TODO: - Delete this module and all associated references and tests
//       - Remove all traces of mouse driven contextual help logic from the codebase
function target(domElement, onHit, position = { horizontal: 'right', vertical: 'bottom' }) {
  if (element) return;

  element = domElement;
  anchor = position;
  onHitHandler = onHit;
  addListener();

  // Return a handler to the calling code so this event can be cancelled.
  return () => removeListener();
}

function handleMouseMove(event) {
  const { clientX: mouseX, clientY: mouseY } = event;
  const hitbox = getElementHitbox(element, anchor);

  if (__DEV__) {
    drawDebugBox(hitbox);
  }

  if (pointInHitbox(mouseX, mouseY, hitbox)) {
    onHitHandler();
    removeListener();
  }
}

function getElementHitbox(element, anchor) {
  const bounds = element.getBoundingClientRect();
  const x = (anchor.horizontal === 'left') ? bounds.left : bounds.left - bounds.width;
  const y = (anchor.vertical === 'top') ? bounds.top : bounds.top - bounds.height;

  return {
    x,
    y,
    width: bounds.width * HITBOX_SCALE,
    height: bounds.height * HITBOX_SCALE
  };
}

function pointInHitbox(x, y, hitbox) {
  const right = hitbox.x + hitbox.width;
  const bottom = hitbox.y + hitbox.height;

  return (x > hitbox.x && x < right) &&
         (y > hitbox.y && y < bottom);
}

function addListener() {
  document.addEventListener('mousemove', handleMouseMove);
}

function removeListener() {
  document.removeEventListener('mousemove', handleMouseMove);
}

function drawDebugBox(hitbox) {
  const rect = document.getElementById('zeBox');

  if (!rect) {
    return;
  }

  rect.setAttribute('x', hitbox.x);
  rect.setAttribute('y', hitbox.y);
  rect.setAttribute('width', hitbox.width);
  rect.setAttribute('height', hitbox.height);
}

export const mouse = {
  target,
  _getElementHitbox: getElementHitbox,
  _pointInHitbox: pointInHitbox
};
