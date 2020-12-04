const keyCodes = {
  ENTER: 13,
  SPACE: 32
}

const triggerOnEnter = callback => e => {
  if (e.keyCode === keyCodes.ENTER && !e.shiftKey) {
    e.preventDefault()
    callback(e)
  }
}

export { keyCodes, triggerOnEnter }
