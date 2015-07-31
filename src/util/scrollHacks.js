import { win, document as doc } from 'utility/globals';

let oldHostBodyStyle;
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
  console.log('setScrollKiller', active);
  if (active) {
    if (!scrollKillerActive) {
      oldHostBodyStyle = doc.body.getAttribute('style');

      doc.body.setAttribute('style', `${oldHostBodyStyle};position:fixed;`);
      scrollKillerActive = true;
    }
  } else {
    if (scrollKillerActive) {
      doc.body.setAttribute('style', oldHostBodyStyle);
      scrollKillerActive = false;
    }
  }
}

export {
  setScrollKiller,
  setWindowScroll,
  revertWindowScroll
};
