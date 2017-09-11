import {
  SDK_CHAT_MSG,
} from '../chat-action-types';

const initialState = {
  nick: '',
  display_name: '',
  msg: '',
  show: false
};

const notification = (state = initialState, action) => {

  switch (action.type) {
    case SDK_CHAT_MSG:
      const agentDetails = action.payload.detail;

      return {
        nick: agentDetails.nick,
        display_name: agentDetails.display_name,
        msg: agentDetails.msg,
        show: true
      };
    default:
      return state;
  }
};

export default notification;
