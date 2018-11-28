import 'utility/i18nTestHelper';

import * as apis from '../apis';
import * as baseActionTypes from 'src/redux/modules/base/base-action-types';
import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types';
import * as constants from 'constants/api';
import * as chatActions from 'src/redux/modules/chat/chat-actions';
import * as settingsActions from 'src/redux/modules/settings/settings-actions';
import * as baseActions from 'src/redux/modules/base/base-actions';
import * as hcActions from 'src/redux/modules/helpCenter/helpCenter-actions';

import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
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

const mockActionValue = Date.now();
const mockAction = jest.fn(() => mockActionValue);
const setActiveEmbed = (activeEmbed) => {
  baseSelectors.getActiveEmbed = jest.fn(() => activeEmbed);
};

describe('updateSettingsLegacyApi', () => {
  let newSettings;

  beforeEach(() => {
    newSettings = {
      offset: {
        horizontal: 10
      }
    };
  });

  it('calls settings.updateSettingsLegacy', () => {
    apis.updateSettingsLegacyApi(newSettings);

    expect(settings.updateSettingsLegacy)
      .toHaveBeenCalledWith(newSettings, expect.any(Function));
  });
});

describe('endChatApi', () => {
  beforeEach(() => {
    chatActions.endChat = mockAction;
  });

  it('dispatches the endChat action', () => {
    apis.endChatApi(mockStore);

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

describe('sendChatMsgApi', () => {
  let sendMsg;

  beforeEach(() => {
    sendMsg = jest.fn();

    chatActions.sendMsg = sendMsg;
  });

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

test('identify calls mediator', () => {
  apis.identifyApi(mockStore, { x: 1 });
  expect(mediator.channel.broadcast)
    .toHaveBeenCalledWith('.onIdentify', { x: 1 });
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
    const setLocale = jest.fn(() => 'setLocale');

    baseActions.setLocale = setLocale;

    apis.setLocaleApi(mockStore, 'en');
  });

  it('calls mediator', () => {
    expect(mediator.channel.broadcast)
      .toHaveBeenCalledWith('.onSetLocale');
  });
});

describe('updateSettingsApi', () => {
  beforeEach(() => {
    settingsActions.updateSettings = mockAction;
  });

  it('dispatches the updateSettings action', () => {
    apis.updateSettingsApi(mockStore);

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

describe('logoutApi', () => {
  let logoutValue = Date.now()
    , chatLogoutValue = Date.now();

  beforeEach(() => {
    const logout = jest.fn(() => logoutValue);
    const chatLogout = jest.fn(() => chatLogoutValue);

    baseActions.logout = logout;
    chatActions.chatLogout = chatLogout;

    apis.logoutApi(mockStore);
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
});

describe('setHelpCenterSuggestionsApi', () => {
  beforeEach(() => {
    hcActions.setContextualSuggestionsManually = mockAction;
  });

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
  beforeEach(() => {
    baseActions.hideRecieved = mockAction;
  });

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
  beforeEach(() => {
    chatActions.sendVisitorPath = mockAction;
    apis.updatePathApi(mockStore, 'hello');
  });

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
