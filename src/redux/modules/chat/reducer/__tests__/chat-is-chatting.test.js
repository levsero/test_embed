import * as actions from 'src/redux/modules/chat/chat-action-types';
import { store } from 'service/persistence';
import { testReducer } from 'src/util/testHelpers';
import { createStore } from 'redux';
import reducer from 'src/redux/modules/reducer';

let chatIsChatting = require('../chat-is-chatting').default;

const agentPayload = {
  detail: {
    nick: 'agent:xxx'
  }
};
const visitorPayload = {
  detail: {
    nick: 'visitor:xxx'
  }
};

describe('chatDefaultDepartment initialState', () => {
  it('sets the state to false when there is nothing in local storage', () => {
    expect(chatIsChatting(undefined, { type: '' })).toEqual(false);
  });

  it('sets the state to the value in local storage if it exists', () => {
    // Simulates the store before the page is refreshed
    const reduxStore = createStore(reducer);

    store.init(reduxStore);
    store.set('store', { 'is_chatting': true });
    jest.resetModules();

    chatIsChatting = require('../chat-is-chatting').default;
    // rerequire simulates page refresh
    expect(chatIsChatting(undefined, { type: '' })).toEqual(true);

    store.clear();
  });
});

testReducer(chatIsChatting, [
  {
    action: {
      type: actions.IS_CHATTING,
      payload: true
    },
    initialState: false,
    expected: true
  },
  {
    action: {
      type: actions.SDK_CHAT_MEMBER_JOIN,
      payload: visitorPayload
    },
    initialState: false,
    expected: true,
    extraDesc: 'when the payload is from a visitor'
  },
  {
    action: {
      type: actions.SDK_CHAT_MEMBER_JOIN,
      payload: agentPayload
    },
    initialState: false,
    expected: false,
    extraDesc: 'when the payload is from an agent'
  },
  {
    action: {
      type: actions.SDK_CHAT_MEMBER_LEAVE,
      payload: visitorPayload
    },
    initialState: true,
    expected: false,
    extraDesc: 'when the payload is from a visitor'
  },
  {
    action: {
      type: actions.SDK_CHAT_MEMBER_LEAVE,
      payload: agentPayload
    },
    initialState: true,
    expected: true,
    extraDesc: 'when the payload is from an agent'
  },
  {
    action: {
      type: actions.END_CHAT_REQUEST_SUCCESS
    },
    initialState: true,
    expected: false
  },
]);
