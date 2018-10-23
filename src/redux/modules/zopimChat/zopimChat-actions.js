import { mediator } from 'service/mediator';
import {
  ZOPIM_CHAT_ON_STATUS_UPDATE,
  ZOPIM_HIDE,
  ZOPIM_SHOW,
  ZOPIM_CONNECTED,
  ZOPIM_ON_CLOSE,
  ZOPIM_IS_CHATTING,
  ZOPIM_END_CHAT } from './zopimChat-action-types';
import { getWebWidgetVisible } from 'src/redux/modules/selectors';
import { updateActiveEmbed } from 'src/redux/modules/base';

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

export function zopimIsChatting() {
  return {
    type: ZOPIM_IS_CHATTING
  };
}

export function zopimEndChat() {
  return {
    type: ZOPIM_END_CHAT
  };
}

export function zopimProactiveMessageRecieved() {
  return (dispatch, getState) => {
    const state = getState();

    if (!getWebWidgetVisible(state)) {
      dispatch(updateActiveEmbed('zopimChat'));
      mediator.channel.broadcast('zopimChat.show');
    }
  };
}
