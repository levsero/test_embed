import { getZChatVendor } from 'src/redux/modules/chat/chat-selectors';
import { TIMEOUT } from 'src/constants/chat';
import async from 'async';

export function zChatWithTimeout(getState, methodName, timeout=TIMEOUT) {
  const state = getState();
  const zChat = getZChatVendor(state);

  return async.timeout(zChat[methodName], timeout);
}
