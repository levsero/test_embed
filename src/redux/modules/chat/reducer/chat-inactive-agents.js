import _ from 'lodash';
import {
  SDK_CHAT_MEMBER_JOIN,
  CHAT_AGENT_INACTIVE,
  CHAT_ALL_AGENTS_INACTIVE
} from '../chat-action-types';

const initialState = {};

const isAgent = (nick) => nick.indexOf('agent:') > -1;

const inactiveAgents = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CHAT_AGENT_INACTIVE:
      if (isAgent(payload.nick)) {
        return {
          ...state,
          [payload.nick]: {
            ...payload
          }
        };
      }
      return state;
    case SDK_CHAT_MEMBER_JOIN:
      const nickname = _.get(payload, 'detail.nick');

      if (isAgent(nickname)) {
        _.unset(state, nickname);
      }
      return state;
    case CHAT_ALL_AGENTS_INACTIVE:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
};

export default inactiveAgents;
