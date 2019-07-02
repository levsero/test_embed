import { CONNECTION_CLOSED_REASON, SDK_ACTION_TYPE_PREFIX } from 'constants/chat';
import { chatBanned } from 'src/redux/modules/chat';
import { SDK_ACCOUNT_STATUS, SDK_DEPARTMENT_UPDATE } from 'src/redux/modules/chat/chat-action-types';
import * as callbacks from 'service/api/callbacks';
import { CHAT_DEPARTMENT_STATUS_EVENT, CHAT_STATUS_EVENT } from 'constants/event';

const fireWidgetChatEvent = (action) => {
  switch (action.type) {
    case SDK_DEPARTMENT_UPDATE:
      callbacks.fireFor(CHAT_DEPARTMENT_STATUS_EVENT, [action.payload.detail]);
      break;
    case SDK_ACCOUNT_STATUS:
      callbacks.fireFor(CHAT_STATUS_EVENT);
      break;
  }
};

const fireChatBannedEvent = (zChat, dispatch, data) => {
  if (data.type === 'connection_update' && data.detail === 'closed') {
    if (zChat.getConnectionClosedReason() === CONNECTION_CLOSED_REASON.BANNED) {
      dispatch(chatBanned());
    }
  }
};

const firehoseListener = (zChat, dispatch) => (data) => {
  let actionType;

  if (data.type === 'history') {
    actionType = `${SDK_ACTION_TYPE_PREFIX}/history/${data.detail.type}`;
  } else {
    actionType = data.detail.type
      ? `${SDK_ACTION_TYPE_PREFIX}/${data.detail.type}`
      : `${SDK_ACTION_TYPE_PREFIX}/${data.type}`;
  }

  if (data.type === 'chat' && data.detail && !data.detail.timestamp) {
    data.detail.timestamp = Date.now();
  }

  const chatAction = {
    type: actionType,
    payload: data
  };

  dispatch(chatAction);
  fireWidgetChatEvent(chatAction);
  fireChatBannedEvent(zChat, dispatch, data);
};

export default firehoseListener;
