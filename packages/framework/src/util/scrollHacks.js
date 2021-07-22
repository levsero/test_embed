import { setScaleLock } from 'utility/devices'
import { win, document as doc } from 'utility/globals'

let oldHostBodyPosition
let oldWindowScrollY = null
let scrollKillerActive = false
let oldPositionTop, oldPositionBottom, oldPositionLeft, oldPositionRight, oldMargin

function setWindowScroll(y) {
  if (oldWindowScrollY === null) {
    oldWindowScrollY = win.scrollY
  }
  win.scrollTo(win.scrollX, y)
}

function revertWindowScroll() {
  if (oldWindowScrollY !== null) {
    win.scrollTo(win.scrollX, oldWindowScrollY)
    oldWindowScrollY = null
  }
}

function setScrollKiller(active) {
  if (active) {
    if (!scrollKillerActive) {
      // store the current values for the properties we are about to update so we can revert them when they are not
      // needed anymore. This is so the customer's website is not affected.
      oldHostBodyPosition = doc.body.style.position
      oldPositionTop = doc.body.style.top
      oldPositionBottom = doc.body.style.bottom
      oldPositionLeft = doc.body.style.left
      oldPositionRight = doc.body.style.right
      oldMargin = doc.body.style.margin

      // position is set to fixed to prevent host page from scrolling when user scrolls within the widget
      doc.body.style.position = 'fixed'

      // on safari mobile, fixed position elements are affected by their fixed position parents. If the doc body has
      // "overflow: hidden;" we need to make sure the body takes up the entire browser, so the full widget
      // is visible for the user
      doc.body.style.top = 0
      doc.body.style.bottom = 0
      doc.body.style.left = 0
      doc.body.style.right = 0
      doc.body.style.margin = 0
      scrollKillerActive = true
    }
  } else {
    if (scrollKillerActive) {
      doc.body.style.position = oldHostBodyPosition
      doc.body.style.top = oldPositionTop
      doc.body.style.bottom = oldPositionBottom
      doc.body.style.left = oldPositionLeft
      doc.body.style.right = oldPositionRight
      doc.body.style.margin = oldMargin
      scrollKillerActive = false
    }
  }
}

function scrollLockHostPage(lockIt) {
  if (lockIt) {
    setScaleLock(true)
    setWindowScroll(0)
    setScrollKiller(true)
  } else {
    setScaleLock(false)
    setScrollKiller(false)
    revertWindowScroll()
  }
}

export { setScrollKiller, setWindowScroll, revertWindowScroll, scrollLockHostPage }
