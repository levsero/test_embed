import Map from 'core-js/library/es6/map';
import {
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_TYPING,
  SDK_AGENT_UPDATE,
  SDK_CHAT_MEMBER_LEAVE,
  END_CHAT_REQUEST_SUCCESS,
  CHAT_RECONNECT
} from '../chat-action-types';

const initialState = new Map();

const isAgent = (nick) => nick.indexOf('agent:') > -1;

const concatOrUpdateAgent = (agents, nickname, data) => {
  const copy = new Map(agents),
    prevAgent = agents.get(nickname);

  copy.set(nickname, { ...prevAgent, ...data});
  return copy;
};

const removeAgent = (agents, nickname) => {
  const copy = new Map(agents);

  copy.delete(nickname);
  return copy;
};

const agents = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case SDK_CHAT_MEMBER_JOIN:
      if (isAgent(payload.detail.nick)) {
        return concatOrUpdateAgent(state, payload.detail.nick, { nick: payload.detail.nick });
      }
      return state;
    case SDK_CHAT_TYPING:
      return concatOrUpdateAgent(state, payload.detail.nick, { typing: payload.detail.typing });
    case SDK_AGENT_UPDATE:
      const { nick: nickname } = payload.detail;
      const typing = !!(state[nickname] && state[nickname].typing);

      return concatOrUpdateAgent(state, payload.detail.nick, { ...payload.detail, nick: payload.detail.nick, typing });
    case SDK_CHAT_MEMBER_LEAVE:
      if (isAgent(payload.detail.nick)) {
        return removeAgent(state, payload.detail.nick);
      }
      return state;
    case END_CHAT_REQUEST_SUCCESS:
    case CHAT_RECONNECT:
      return initialState;
    default:
      return state;
  }
};

export default agents;
