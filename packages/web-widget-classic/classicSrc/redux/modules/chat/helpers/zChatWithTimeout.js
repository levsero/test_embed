import asyncTimeout from 'async/timeout'
import { TIMEOUT } from 'classicSrc/constants/chat'
import { getZChatVendor } from 'classicSrc/embeds/chat/selectors'

export function zChatWithTimeout(getState, methodName, timeout = TIMEOUT) {
  const zChat = getZChatVendor(getState())

  return asyncTimeout(zChat[methodName], timeout)
}

export function canBeIgnored(err) {
  return err ? err.code === 'ETIMEDOUT' : true
}
