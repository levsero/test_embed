/* eslint-disable camelcase */
import zChat from 'vendor/web-sdk';

export function msgActionPayload(msg) {
  return {
    type: 'chat',
    detail: {
      type: 'chat.msg',
      nick: 'visitor:xxxx',
      timestamp: Date.now(),
      display_name: 'Visitor Joe',
      msg: msg
    }
  };
}

export function sendMsg(msg) {
  return (dispatch) => {
    zChat.sendChatMsg(msg, (err) => {
      if (!err) {
        dispatch({
          type: 'SENT_CHAT_MSG',
          payload: msgActionPayload(msg)
        });
      }
    });
  };
}

export function updateCurrentMsg(msg) {
  return {
    type: 'UPDATE_CHAT_MSG',
    payload: msg
  };
}
