import { sendStartTyping, sendStopTyping } from 'src/apps/messenger/api/sunco'

const stopTypingBufferMillis = 10000

let timeout

const cancelTyping = () => {
  if (!timeout) {
    return
  }

  clearTimeout(timeout)
  timeout = null
}

const stopTyping = () => {
  if (timeout) {
    sendStopTyping()
    cancelTyping()
  }
}

const startTyping = () => {
  if (!timeout) {
    sendStartTyping()
  }

  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(stopTyping, stopTypingBufferMillis)
}

export { startTyping, stopTyping, cancelTyping }
