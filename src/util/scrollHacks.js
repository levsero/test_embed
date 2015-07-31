import { win, document as doc } from 'utility/globals';

let oldHostBodyPosition;
let oldWindowScrollY = null;
let scrollKillerActive = false;

function setWindowScroll(y) {
  if (oldWindowScrollY === null) {
    oldWindowScrollY = win.scrollY;
  }
  win.scrollTo(win.scrollX, y);
}

function revertWindowScroll() {
  if (oldWindowScrollY !== null) {
    win.scrollTo(win.scrollX, oldWindowScrollY);
    oldWindowScrollY = null;
  }
}

function setScrollKiller(active) {
  if (active) {
    if (!scrollKillerActive) {
      oldHostBodyPosition = doc.body.style.position;

      doc.body.style.position = 'fixed';
      scrollKillerActive = true;
    }
  } else {
    if (scrollKillerActive) {
      doc.body.style.position = oldHostBodyPosition;
      scrollKillerActive = false;
    }
  }
}

export {
  setScrollKiller,
  setWindowScroll,
  revertWindowScroll
};
