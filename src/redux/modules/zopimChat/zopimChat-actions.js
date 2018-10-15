import {
  ZOPIM_CHAT_ON_STATUS_UPDATE,
  ZOPIM_HIDE,
  ZOPIM_SHOW,
  ZOPIM_CONNECTED,
  ZOPIM_ON_CLOSE,
  ZOPIM_IS_CHATTING } from './zopimChat-action-types';

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

export function zopimOnClose() {
  return {
    type: ZOPIM_ON_CLOSE
  };
}

export function zopimIsChatting(open) {
  return {
    type: ZOPIM_IS_CHATTING,
    payload: open
  };
}
