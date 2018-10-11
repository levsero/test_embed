import {
  ZOPIM_CHAT_ON_STATUS_UPDATE,
  ZOPIM_HIDE,
  ZOPIM_SHOW,
  ZOPIM_CONNECTED } from './zopimChat-action-types';

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

export function zopimShow() {
  return {
    type: ZOPIM_SHOW
  };
}

export function zopimConnectionUpdate() {
  return {
    type: ZOPIM_CONNECTED
  };
}
