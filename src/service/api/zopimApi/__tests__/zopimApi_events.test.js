import zopimApi from '..';

import * as baseActionTypes from 'src/redux/modules/base/base-action-types';
import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types';
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors';
import * as callbacks from 'service/api/callbacks';
import {
  API_ON_CHAT_END_NAME,
  API_ON_CHAT_START_NAME,
  API_ON_CHAT_CONNECTED_NAME
} from 'constants/api';

const mockStore = {
  dispatch: jest.fn()
};

describe('zopim events', () => {
  const mockWin = {};
  let callback = jest.fn(() => 123);

  beforeEach(() => {
    zopimApi.setUpZopimApiMethods(mockWin, mockStore);
  });

  test('onShow fire widget open event', async () => {
    expect(callback).not.toHaveBeenCalled();
    mockWin.$zopim.livechat.window.onHide(callback);
    await(() => {
      expect(callback).toHaveBeenCalled();
    });
  });

  test('onHide fire widget close event', async () => {
    expect(callback).not.toHaveBeenCalled();
    mockWin.$zopim.livechat.window.onHide(callback);
    await(() => {
      expect(callback).toHaveBeenCalled();
    });
  });

  test('setOnConnected callback', () => {
    mockWin.$zopim.livechat.setOnConnected(callback);

    callbacks.fireEventsFor(API_ON_CHAT_CONNECTED_NAME);

    expect(callback)
      .toHaveBeenCalled();
  });

  test('setOnChatStart callback', () => {
    mockWin.$zopim.livechat.setOnChatStart(callback);

    callbacks.fireEventsFor(API_ON_CHAT_START_NAME);

    expect(callback)
      .toHaveBeenCalled();
  });

  test('setOnChatEnd callback', () => {
    mockWin.$zopim.livechat.setOnChatEnd(callback);

    callbacks.fireEventsFor(API_ON_CHAT_END_NAME);

    expect(callback)
      .toHaveBeenCalled();
  });

  test('setOnUnreadMsgs dispatches the NEW_AGENT_MESSAGE_RECEIVED action', () => {
    mockWin.$zopim.livechat.setOnUnreadMsgs(callback);

    expect(mockStore.dispatch)
      .toBeCalledWith(expect.objectContaining(
        {
          type: baseActionTypes.API_ON_RECEIVED,
          payload: expect.objectContaining(
            {
              actionType: chatActionTypes.NEW_AGENT_MESSAGE_RECEIVED,
              callback
            }
          )
        }
      ));
  });

  describe('setOnStatus', () => {
    it('dispatches the SDK_ACCOUNT_STATUS and SDK_DEPARTMENT_UPDATE actions', () => {
      mockWin.$zopim.livechat.setOnStatus(callback);

      expect(mockStore.dispatch)
        .toHaveBeenNthCalledWith(1, expect.objectContaining(
          {
            type: baseActionTypes.API_ON_RECEIVED,
            payload: expect.objectContaining(
              {
                actionType: chatActionTypes.SDK_ACCOUNT_STATUS,
                selectors: [chatSelectors.getChatStatus],
                callback
              }
            )
          }
        ));

      expect(mockStore.dispatch)
        .toHaveBeenNthCalledWith(2, expect.objectContaining(
          {
            type: baseActionTypes.API_ON_RECEIVED,
            payload: expect.objectContaining(
              {
                actionType: chatActionTypes.SDK_DEPARTMENT_UPDATE,
                callback: expect.any(Function),
                selectors: [chatSelectors.getChatStatus]
              }
            )
          }
        ));
    });

    it('stores a debounced callback', (done) => {
      mockWin.$zopim.livechat.setOnStatus(callback);

      const payloadCallback = mockStore.dispatch.mock.calls[1][0].payload.callback;

      payloadCallback();
      expect(callback)
        .not.toHaveBeenCalled();

      setTimeout(() => {
        expect(callback)
          .toHaveBeenCalled();
        done();
      }, 1);
    });
  });
});
