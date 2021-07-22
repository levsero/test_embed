import asyncTimeout from 'async/timeout'
import { TIMEOUT } from 'src/constants/chat'
import { getZChatVendor } from 'src/redux/modules/chat/chat-selectors'

export function zChatWithTimeout(getState, methodName, timeout = TIMEOUT) {
  const zChat = getZChatVendor(getState())

  return asyncTimeout(zChat[methodName], timeout)
}

export function canBeIgnored(err) {
  return err ? err.code === 'ETIMEDOUT' : true
}
