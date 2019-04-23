import * as apis from '../apis';
import * as baseActionTypes from 'src/redux/modules/base/base-action-types';
import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types';
import * as constants from 'constants/api';
import * as chatActions from 'src/redux/modules/chat/chat-actions/actions';
import * as settingsActions from 'src/redux/modules/settings/settings-actions';
import * as baseActions from 'src/redux/modules/base/base-actions';
import * as hcActions from 'src/redux/modules/helpCenter/helpCenter-actions';
import { i18n } from 'service/i18n';

import { chat as zopimChat } from 'embed/chat/chat';
import { mediator } from 'service/mediator';
import { beacon } from 'service/beacon';
import { getWidgetDisplayInfo } from 'src/redux/modules/selectors';
import {
  getIsChatting,
  getChatStatus,
  getNotificationCount,
  getDepartment,
  getDepartmentsList
} from 'src/redux/modules/chat/chat-selectors';
import * as baseSelectors from 'src/redux/modules/base/base-selectors';

const mockStore = {
  dispatch: jest.fn(),
  getState: jest.fn()
};

jest.mock('service/mediator');
jest.mock('src/redux/modules/selectors');
jest.mock('src/redux/modules/chat/chat-selectors');
jest.mock('service/settings');
jest.mock('service/beacon');
jest.mock('embed/chat/chat');

const mockActionValue = Date.now();
const mockAction = jest.fn(() => mockActionValue);
const setActiveEmbed = (activeEmbed) => {
  baseSelectors.getActiveEmbed = jest.fn(() => activeEmbed);
};

describe('endChatApi', () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(chatActions, 'endChat')
      .mockImplementation(mockAction);
  });

  afterEach(() => spy.mockRestore());

  it('dispatches the endChat action', () => {
    apis.endChatApi(mockStore);

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

describe('sendChatMsgApi', () => {
  let sendMsg,
    spy;

  beforeEach(() => {
    sendMsg = jest.fn();

    spy = jest.spyOn(chatActions, 'sendMsg')
      .mockImplementation(sendMsg);
  });

  afterEach(() => spy.mockRestore());

  it('dispatches the sendMsg action', () => {
    apis.sendChatMsgApi(mockStore, 'hello world');

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(sendMsg('hello world'));
  });

  it('calls send message with the message', () => {
    apis.sendChatMsgApi(mockStore, 'hello world');

    expect(sendMsg)
      .toHaveBeenCalledWith('hello world');
  });

  it('defaults to empty string if message is not a string', () => {
    apis.sendChatMsgApi(mockStore, undefined);

    expect(sendMsg)
      .toHaveBeenCalledWith('');
  });
});

describe('identify', () => {
  /* eslint-disable no-console */
  beforeEach(() => {
    jest.spyOn(console, 'warn');
    console.warn.mockReturnValue();
  });

  afterEach(() => {
    console.warn.mockRestore();
  });

  describe('when valid', () => {
    let params;

    beforeEach(() => {
      params = {
        name: 'James Dean',
        email: 'james@dean.com'
      };

      apis.identifyApi(mockStore, params);
    });

    it('calls identify and chat setUser', () => {
      expect(beacon.identify)
        .toHaveBeenCalledWith(params);
      expect(zopimChat.setUser)
        .toHaveBeenCalledWith(params);
    });
  });

  describe('when email is invalid', () => {
    let params;

    beforeEach(() => {
      params = {
        name: 'James Dean',
        email: 'james@dean'
      };

      apis.identifyApi(mockStore, params);
    });

    it('does not call identify', () => {
      expect(beacon.identify)
        .not.toHaveBeenCalled();
    });

    it('prints a warning', () => {
      expect(console.warn)
        .toHaveBeenCalledWith('invalid email passed into zE.identify', params.email);
    });

    it('calls chat setUser', () => {
      expect(zopimChat.setUser)
        .toHaveBeenCalledWith(params);
    });
  });

  describe('when name is invalid', () => {
    let params;

    beforeEach(() => {
      params = {
        name: undefined,
        email: 'james@dean.com'
      };

      apis.identifyApi(mockStore, params);
    });

    it('does not call identify', () => {
      expect(beacon.identify)
        .not.toHaveBeenCalled();
    });

    it('prints a warning', () => {
      expect(console.warn)
        .toHaveBeenCalledWith('invalid name passed into zE.identify', params.name);
    });

    it('calls chat setUser', () => {
      expect(zopimChat.setUser)
        .toHaveBeenCalledWith(params);
    });
  });

  describe('when both are invalid', () => {
    let params;

    beforeEach(() => {
      params = {
        name: undefined,
        email: undefined
      };

      apis.identifyApi(mockStore, params);
    });

    it('does not call identify', () => {
      expect(beacon.identify)
        .not.toHaveBeenCalled();
    });

    it('prints a warning', () => {
      expect(console.warn)
        .toHaveBeenCalledWith('invalid params passed into zE.identify', params);
    });

    it('does not call chat setUser', () => {
      expect(zopimChat.setUser)
        .not.toHaveBeenCalledWith(params);
    });
  });
  /* eslint-enable no-console */
});

describe('openApi', () => {
  const setupTestData = (activeEmbed) => {
    setActiveEmbed(activeEmbed);
    apis.openApi(mockStore);
  };

  describe('when the active embed is not zopim chat', () => {
    beforeEach(() => {
      setupTestData('something');
    });

    it('dispatches the openReceived action', () => {
      expect(mockStore.dispatch)
        .toHaveBeenCalledWith({ type: baseActionTypes.OPEN_RECEIVED });

      expect(mediator.channel.broadcast)
        .not.toHaveBeenCalledWith('zopimChat.show');
    });
  });

  describe('when the active embed is zopim chat', () => {
    beforeEach(() => {
      setupTestData('zopimChat');
    });

    it('broadcasts "zopimChat.show" on mediator', () => {
      expect(mockStore.dispatch).not.toHaveBeenCalled();

      expect(mediator.channel.broadcast)
        .toHaveBeenCalledWith('zopimChat.show');
    });
  });
});

describe('closeApi', () => {
  const setupTestData = (activeEmbed) => {
    setActiveEmbed(activeEmbed);
    apis.closeApi(mockStore);
  };

  describe('when the active embed is not zopim chat', () => {
    beforeEach(() => {
      setupTestData('totallynotzopimchat');
    });

    it('only dispatches the closedReceived action', () => {
      expect(mockStore.dispatch)
        .toHaveBeenCalledWith({ type: baseActionTypes.CLOSE_RECEIVED });

      expect(mediator.channel.broadcast).not.toHaveBeenCalled();
    });
  });

  describe('when the active embed is zopim chat', () => {
    beforeEach(() => {
      setupTestData('zopimChat');
    });

    it('dispatches the closedReceived action and broadcasts "zopimChat.hide" on mediator', () => {
      expect(mockStore.dispatch)
        .toHaveBeenCalledWith({ type: baseActionTypes.CLOSE_RECEIVED });

      expect(mediator.channel.broadcast).toHaveBeenCalledWith('zopimChat.hide');
    });
  });
});

describe('toggleApi', () => {
  const setupTestData = (activeEmbed) => {
    setActiveEmbed(activeEmbed);
    apis.toggleApi(mockStore);
  };

  describe('when the active embed is not zopim chat', () => {
    beforeEach(() => {
      setupTestData('totallyNotZopim');
    });

    it('only dispatches the toggleReceived action', () => {
      expect(mockStore.dispatch)
        .toHaveBeenCalledWith({ type: baseActionTypes.TOGGLE_RECEIVED });

      expect(mediator.channel.broadcast).not.toHaveBeenCalled();
    });
  });

  describe('when the active embed is zopim chat', () => {
    beforeEach(() => {
      setupTestData('zopimChat');
    });

    it('only broadcasts "zopimChat.toggle" on mediator', () => {
      expect(mockStore.dispatch).not.toHaveBeenCalled();

      expect(mediator.channel.broadcast)
        .toHaveBeenCalledWith('zopimChat.toggle');
    });
  });
});

test('closeApi dispatches the closeReceived action', () => {
  apis.closeApi(mockStore);

  expect(mockStore.dispatch)
    .toHaveBeenCalledWith({ type: baseActionTypes.CLOSE_RECEIVED });
});

describe('setLocale', () => {
  beforeEach(() => {
    i18n.init(mockStore);
    apis.setLocaleApi('en');
  });

  it('calls mediator', () => {
    expect(mediator.channel.broadcast)
      .toHaveBeenCalledWith('.onSetLocale');
  });
});

describe('updateSettingsApi', () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(settingsActions, 'updateSettings')
      .mockImplementation(mockAction);
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('dispatches the updateSettings action', () => {
    apis.updateSettingsApi(mockStore);

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

describe('logoutApi', () => {
  const logoutValue = Date.now(),
    chatLogoutValue = Date.now(),
    resetValue = { type: 'API_RESET_WIDGET' };
  let baseSpy, chatSpy, resetSpy;

  beforeEach(() => {
    const logout = jest.fn(() => logoutValue),
      chatLogout = jest.fn(() => chatLogoutValue),
      apiReset = jest.fn(() => resetValue);

    baseSpy = jest.spyOn(baseActions, 'logout').mockImplementation(logout);
    chatSpy = jest.spyOn(chatActions, 'chatLogout').mockImplementation(chatLogout);
    resetSpy = jest.spyOn(baseActions, 'apiResetWidget').mockImplementation(apiReset);

    apis.logoutApi(mockStore);
  });

  afterEach(() => {
    baseSpy.mockRestore();
    chatSpy.mockRestore();
    resetSpy.mockRestore();
  });

  it('dispatches the chatLogout action', () => {
    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(chatLogoutValue);
  });

  it('dispatches the logout action', () => {
    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(logoutValue);
  });

  it('calls mediator with the expected broadcast', () => {
    expect(mediator.channel.broadcast)
      .toHaveBeenCalledWith('.logout');
  });

  it('dispatches apiResetWidget', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(resetValue);
  });
});

describe('setHelpCenterSuggestionsApi', () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(hcActions, 'setContextualSuggestionsManually')
      .mockImplementation(mockAction);
  });

  afterEach(() => spy.mockRestore());

  it('dispatches the setContextualSuggestionsManually action', () => {
    apis.setHelpCenterSuggestionsApi(mockStore, { y: 1 });

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

test('prefill dispatches the prefillReceived action', () => {
  apis.prefill(mockStore, { name: 'Wayne', email: 'w@a.com' });

  expect(mockStore.dispatch)
    .toHaveBeenCalledWith(expect.objectContaining(
      { type: baseActionTypes.PREFILL_RECEIVED }
    ));
});

describe('hideApi', () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(baseActions, 'hideRecieved')
      .mockImplementation(mockAction);
  });

  afterEach(() => spy.mockRestore());

  it('dispatches the hideReceived action', () => {
    apis.hideApi(mockStore);

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

test('showApi dispatches the showReceived action', () => {
  apis.showApi(mockStore);

  expect(mockStore.dispatch)
    .toHaveBeenCalledWith(expect.objectContaining(
      { type: baseActionTypes.SHOW_RECEIVED }
    ));
});

test('clearFormState dispatches the apiClearform action', () => {
  apis.clearFormState(mockStore);

  expect(mockStore.dispatch)
    .toHaveBeenCalledWith(expect.objectContaining(
      { type: baseActionTypes.API_CLEAR_FORM }
    ));
});

describe('updatePathApi', () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(chatActions, 'sendVisitorPath')
      .mockImplementation(mockAction);
    apis.updatePathApi(mockStore, 'hello');
  });

  afterEach(() => spy.mockRestore());

  it('calls sendVisitorPath with the argument', () => {
    expect(mockAction)
      .toHaveBeenCalledWith('hello');
  });

  it('dispatches the sendVisitorPath action', () => {
    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

test('displayApi calls getWidgetDisplayInfo', () => {
  const store = { getState: jest.fn() };

  apis.displayApi(store, 123);

  expect(getWidgetDisplayInfo)
    .toHaveBeenCalledWith(store.getState(), 123);
});

test('isChattingApi calls getIsChatting', () => {
  const store = { getState: jest.fn() };

  apis.isChattingApi(store, 123);

  expect(getIsChatting)
    .toHaveBeenCalledWith(store.getState(), 123);
});

test('getDepartmentApi calls getDepartment', () => {
  const store = { getState: jest.fn(() => {}) };

  apis.getDepartmentApi(store, 123);

  expect(getDepartment)
    .toHaveBeenCalledWith(store.getState(), 123);
});

test('getAllDepartmentsApi calls getDepartmentsList', () => {
  const store = { getState: jest.fn(() => {}) };

  apis.getAllDepartmentsApi(store, 123);

  expect(getDepartmentsList)
    .toHaveBeenCalledWith(store.getState(), 123);
});

describe('onApi', () => {
  let on,
    callback;

  beforeEach(() => {
    callback = jest.fn(() => 123);
    on = apis.onApiObj();
  });

  test('if no callback is passed, do nothing', () => {
    on[constants.API_ON_CLOSE_NAME](mockStore, 123);

    expect(mockStore.dispatch)
      .not.toHaveBeenCalled();
  });

  test('API_ON_OPEN_NAME dispatches EXECUTE_API_ON_OPEN_CALLBACK', () => {
    on[constants.API_ON_OPEN_NAME](mockStore, callback);

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

  test('API_ON_CLOSE_NAME dispatches EXECUTE_API_ON_CLOSE_CALLBACK', () => {
    on[constants.API_ON_CLOSE_NAME](mockStore, callback);

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

  test('API_ON_CHAT_CONNECTED_NAME dispatches CHAT_CONNECTED', () => {
    on.chat[constants.API_ON_CHAT_CONNECTED_NAME](mockStore, callback);

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

  test('API_ON_CHAT_END_NAME dispatches END_CHAT_REQUEST_SUCCESS', () => {
    on.chat[constants.API_ON_CHAT_END_NAME](mockStore, callback);

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

  test('API_ON_CHAT_START_NAME dispatches CHAT_STARTED', () => {
    on.chat[constants.API_ON_CHAT_START_NAME](mockStore, callback);

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

  test('API_ON_CHAT_STATUS_NAME dispatches SDK_ACCOUNT_STATUS', () => {
    on.chat[constants.API_ON_CHAT_STATUS_NAME](mockStore, callback);

    expect(mockStore.dispatch)
      .toBeCalledWith(expect.objectContaining(
        {
          type: baseActionTypes.API_ON_RECEIVED,
          payload: expect.objectContaining(
            {
              actionType: chatActionTypes.SDK_ACCOUNT_STATUS,
              callback,
              selectors: [getChatStatus]
            }
          )
        }
      ));
  });

  test('API_ON_CHAT_UNREAD_MESSAGES_NAME dispatches NEW_AGENT_MESSAGE_RECEIVED', () => {
    on.chat[constants.API_ON_CHAT_UNREAD_MESSAGES_NAME](mockStore, callback);

    expect(mockStore.dispatch)
      .toBeCalledWith(expect.objectContaining(
        {
          type: baseActionTypes.API_ON_RECEIVED,
          payload: expect.objectContaining(
            {
              actionType: chatActionTypes.NEW_AGENT_MESSAGE_RECEIVED,
              callback,
              selectors: [getNotificationCount]
            }
          )
        }
      ));
  });

  describe('API_ON_CHAT_DEPARTMENT_STATUS', () => {
    it('dispatches SDK_DEPARTMENT_UPDATE', () => {
      on.chat[constants.API_ON_CHAT_DEPARTMENT_STATUS](mockStore, callback);

      expect(mockStore.dispatch)
        .toBeCalledWith(expect.objectContaining({
          type: baseActionTypes.API_ON_RECEIVED,
          payload: {
            actionType: chatActionTypes.SDK_DEPARTMENT_UPDATE,
            callback,
            selectors: [],
            payloadTransformer: expect.any(Function)
          }
        }));
    });

    it('passes expected transformer', () => {
      on.chat[constants.API_ON_CHAT_DEPARTMENT_STATUS](mockStore, callback);
      const actionPayload = mockStore.dispatch.mock.calls[0][0].payload;
      const sampleSDKPayload = { detail: 12345 };

      expect(actionPayload.payloadTransformer(sampleSDKPayload))
        .toEqual(12345);
    });
  });
});
