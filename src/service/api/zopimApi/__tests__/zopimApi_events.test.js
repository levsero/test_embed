import zopimApi from '..';
import 'utility/i18nTestHelper';

import * as baseActionTypes from 'src/redux/modules/base/base-action-types';
import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types';

const mockStore = {
  dispatch: jest.fn()
};

describe('zopim events', () => {
  const mockWin = {};
  let callback = jest.fn(() => 123);

  beforeEach(() => {
    zopimApi.setUpZopimApiMethods(mockWin, mockStore);
  });

  test('onShow dispatches the EXECUTE_API_ON_OPEN_CALLBACK action', () => {
    mockWin.$zopim.livechat.window.onShow(callback);

    expect(mockStore.dispatch)
      .toBeCalledWith(expect.objectContaining(
        {
          type: baseActionTypes.API_ON_RECEIVED,
          payload: expect.objectContaining(
            {
              actionType: baseActionTypes.EXECUTE_API_ON_OPEN_CALLBACK,
              callback
            }
          )
        }
      ));
  });

  test('onHide dispatches the EXECUTE_API_ON_CLOSE_CALLBACK action', () => {
    mockWin.$zopim.livechat.window.onHide(callback);

    expect(mockStore.dispatch)
      .toBeCalledWith(expect.objectContaining(
        {
          type: baseActionTypes.API_ON_RECEIVED,
          payload: expect.objectContaining(
            {
              actionType: baseActionTypes.EXECUTE_API_ON_CLOSE_CALLBACK,
              callback
            }
          )
        }
      ));
  });

  test('setOnConnected dispatches the CHAT_CONNECTED action', () => {
    mockWin.$zopim.livechat.setOnConnected(callback);

    expect(mockStore.dispatch)
      .toBeCalledWith(expect.objectContaining(
        {
          type: baseActionTypes.API_ON_RECEIVED,
          payload: expect.objectContaining(
            {
              actionType: chatActionTypes.CHAT_CONNECTED,
              callback
            }
          )
        }
      ));
  });

  test('setOnChatStart dispatches the CHAT_STARTED action', () => {
    mockWin.$zopim.livechat.setOnChatStart(callback);

    expect(mockStore.dispatch)
      .toBeCalledWith(expect.objectContaining(
        {
          type: baseActionTypes.API_ON_RECEIVED,
          payload: expect.objectContaining(
            {
              actionType: chatActionTypes.CHAT_STARTED,
              callback
            }
          )
        }
      ));
  });

  test('setOnChatEnd dispatches the END_CHAT_REQUEST_SUCCESS action', () => {
    mockWin.$zopim.livechat.setOnChatEnd(callback);

    expect(mockStore.dispatch)
      .toBeCalledWith(expect.objectContaining(
        {
          type: baseActionTypes.API_ON_RECEIVED,
          payload: expect.objectContaining(
            {
              actionType: chatActionTypes.END_CHAT_REQUEST_SUCCESS,
              callback
            }
          )
        }
      ));
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

  test('setOnStatus dispatches the SDK_ACCOUNT_STATUS action', () => {
    mockWin.$zopim.livechat.setOnStatus(callback);

    expect(mockStore.dispatch)
      .toBeCalledWith(expect.objectContaining(
        {
          type: baseActionTypes.API_ON_RECEIVED,
          payload: expect.objectContaining(
            {
              actionType: chatActionTypes.SDK_ACCOUNT_STATUS,
              callback
            }
          )
        }
      ));
  });
});
