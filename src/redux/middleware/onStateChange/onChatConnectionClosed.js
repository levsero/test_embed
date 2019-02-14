import { getConnectionClosedReason } from 'src/redux/modules/chat/chat-selectors';
import { SDK_CONNECTION_UPDATE } from 'src/redux/modules/chat/chat-action-types';
import { chatBanned } from 'src/redux/modules/chat';
import { CONNECTION_CLOSED_REASON } from 'constants/chat';

export default function onChatConnectionClosed(previousState, nextState, action, dispatch) {
  if (action.type === SDK_CONNECTION_UPDATE) {
    if (action.payload.detail === 'closed') {
      if (getConnectionClosedReason(nextState) === CONNECTION_CLOSED_REASON.BANNED) {
        dispatch(chatBanned());
      }
    }
  }
}
