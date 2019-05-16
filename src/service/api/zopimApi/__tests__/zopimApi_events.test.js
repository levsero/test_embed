import { wait } from 'react-testing-library';
import zopimApi from '..';

import createStore from 'src/redux/createStore';
import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types';
import * as callbacks from 'service/api/callbacks';
import {
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_CONNECTED_NAME,
  API_ON_CHAT_UNREAD_MESSAGES_NAME,
  API_ON_CHAT_DEPARTMENT_STATUS,
  API_ON_CHAT_STATUS_NAME
} from 'constants/api';

const setup = () => {
  const mockWin = {};
  const callback = jest.fn(() => 123);
  const store = createStore();

  zopimApi.setUpZopimApiMethods(mockWin, store);

  return {
    mockWin,
    store,
    callback
  };
};

describe('zopim events', () => {
  test('onShow fire widget open event', async () => {
    const { callback, mockWin } = setup();

    expect(callback).not.toHaveBeenCalled();
    mockWin.$zopim.livechat.window.onHide(callback);
    await(() => {
      expect(callback).toHaveBeenCalled();
    });
  });

  test('onHide fire widget close event', async () => {
    const { callback, mockWin } = setup();

    expect(callback).not.toHaveBeenCalled();
    mockWin.$zopim.livechat.window.onHide(callback);
    await(() => {
      expect(callback).toHaveBeenCalled();
    });
  });

  test('setOnConnected callback', () => {
    const { callback, mockWin } = setup();

    mockWin.$zopim.livechat.setOnConnected(callback);

    callbacks.fireEventsFor(API_ON_CHAT_CONNECTED_NAME);

    expect(callback)
      .toHaveBeenCalled();
  });

  test('setOnChatStart callback', () => {
    const { callback, mockWin } = setup();

    mockWin.$zopim.livechat.setOnChatStart(callback);

    callbacks.fireEventsFor(API_ON_CHAT_START_NAME);

    expect(callback)
      .toHaveBeenCalled();
  });

  test('setOnChatEnd callback', () => {
    const { callback, mockWin } = setup();

    mockWin.$zopim.livechat.setOnChatEnd(callback);

    callbacks.fireEventsFor(API_ON_CHAT_END_NAME);

    expect(callback)
      .toHaveBeenCalled();
  });

  test('setOnUnreadMsgs callback', async () => {
    const { callback, mockWin, store } = setup();

    mockWin.$zopim.livechat.setOnUnreadMsgs(callback);
    expect(callback).not.toHaveBeenCalled();

    store.dispatch({
      type: chatActionTypes.NEW_AGENT_MESSAGE_RECEIVED,
      payload: {
        proactive: true,
        nick: 'black hole',
        display_name: 'black hole', // eslint-disable-line camelcase
        msg: 'check it'
      }
    });
    callbacks.fireEventsFor(API_ON_CHAT_UNREAD_MESSAGES_NAME);

    await wait(() => {
      expect(callback).toHaveBeenCalledWith(1);
    });
  });

  describe('setOnStatus', () => {
    it('dispatches the SDK_ACCOUNT_STATUS and SDK_DEPARTMENT_UPDATE actions', async () => {
      const { callback, mockWin, store } = setup();

      store.dispatch({ type: chatActionTypes.SDK_ACCOUNT_STATUS, payload: { detail: 'yeetStat' } });

      mockWin.$zopim.livechat.setOnStatus(callback);
      expect(callback).not.toHaveBeenCalled();

      callbacks.fireEventsFor(API_ON_CHAT_STATUS_NAME);
      callbacks.fireEventsFor(API_ON_CHAT_DEPARTMENT_STATUS);

      await wait(() => {
        expect(callback).toHaveBeenCalledWith('yeetStat');
        expect(callback).toHaveBeenCalledTimes(2);
      });
    });
  });
});
