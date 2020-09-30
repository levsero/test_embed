import { getClient } from 'src/apps/messenger/suncoClient'

const stopTypingBufferMillis = 10000

let timeout

const stopTyping = () => {
  if (!timeout) {
    return
  }

  clearTimeout(timeout)
  timeout = null
  getClient().activity.stopTyping()
}

const startTyping = () => {
  if (!timeout) {
    getClient().activity.startTyping()
  }

  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(stopTyping, stopTypingBufferMillis)
}

export { startTyping, stopTyping }
