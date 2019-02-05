import { getZChatVendor } from 'src/redux/modules/chat/chat-selectors';
import { TIMEOUT } from 'src/constants/chat';
import asyncTimeout from 'async/timeout';

export default function zChatWithTimeout(getState, methodName, timeout=TIMEOUT) {
  const state = getState();
  const zChat = getZChatVendor(state);

  return asyncTimeout(zChat[methodName], timeout);
}
