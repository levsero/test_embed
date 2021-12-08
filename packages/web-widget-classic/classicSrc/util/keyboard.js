const keyCodes = {
  ENTER: 'Enter',
  SPACE: 'Space',
}

const triggerOnEnter = (callback) => (e) => {
  if ((e.key === keyCodes.ENTER && !e.shiftKey) || (e.key === keyCodes.SPACE && !e.shiftKey)) {
    e.preventDefault()
    callback(e)
  }
}

export { keyCodes, triggerOnEnter }
