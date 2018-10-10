import { ZOPIM_CHAT_ON_STATUS_UPDATE, ZOPIM_HIDE } from './zopimChat-action-types';

export function updateZopimChatStatus(status) {
  return {
    type: ZOPIM_CHAT_ON_STATUS_UPDATE,
    payload: status
  };
}

export function zopimHide() {
  return {
    type: ZOPIM_HIDE
  };
}
