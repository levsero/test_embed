import { ZOPIM_CHAT_ON_STATUS_UPDATE } from './zopimChat-action-types';

export function updateZopimChatStatus(status) {
  return {
    type: ZOPIM_CHAT_ON_STATUS_UPDATE,
    payload: status
  };
}
