import * as apis from '../apis';
import * as baseActionTypes from 'src/redux/modules/base/base-action-types';
import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types';
import * as constants from 'constants/api';
import * as eventConstants from 'constants/event';
import * as chatActions from 'src/redux/modules/chat/chat-actions/actions';
import * as settingsActions from 'src/redux/modules/settings/settings-actions';
import * as baseActions from 'src/redux/modules/base/base-actions';
import * as hcActions from 'src/redux/modules/helpCenter/helpCenter-actions';
import { i18n } from 'service/i18n';
import { wait } from 'react-testing-library';

import { chat as zopimChat } from 'embed/chat/chat';
import { mediator } from 'service/mediator';
import { beacon } from 'service/beacon';
import { identity } from 'service/identity';
import * as baseSelectors from 'src/redux/modules/base/base-selectors';
import createStore from 'src/redux/createStore';
import * as callbacks from 'service/api/callbacks';

jest.mock('service/mediator');
jest.mock('service/settings');
jest.mock('service/beacon');
jest.mock('service/identity');
jest.mock('embed/chat/chat');

const mockActionValue = Date.now();
const mockAction = jest.fn(() => mockActionValue);
const setActiveEmbed = (activeEmbed) => {
  baseSelectors.getActiveEmbed = jest.fn(() => activeEmbed);
};

describe('endChatApi', () => {
  let spy,
    store;

  beforeEach(() => {
    spy = jest.spyOn(chatActions, 'endChat')
      .mockImplementation(mockAction);
    store = createStore();

    store.dispatch = jest.fn();
  });

  afterEach(() => spy.mockRestore());

  it('dispatches the endChat action', () => {
    apis.endChatApi(store);

    expect(store.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

describe('sendChatMsgApi', () => {
  let sendMsg,
    spy,
    store;

  beforeEach(() => {
    store = createStore();

    store.dispatch = jest.fn();
    sendMsg = jest.fn();

    spy = jest.spyOn(chatActions, 'sendMsg')
      .mockImplementation(sendMsg);
  });

  afterEach(() => spy.mockRestore());

  it('dispatches the sendMsg action', () => {
    apis.sendChatMsgApi(store, 'hello world');

    expect(store.dispatch)
      .toHaveBeenCalledWith(sendMsg('hello world'));
  });

  it('calls send message with the message', () => {
    apis.sendChatMsgApi(store, 'hello world');

    expect(sendMsg)
      .toHaveBeenCalledWith('hello world');
  });

  it('defaults to empty string if message is not a string', () => {
    apis.sendChatMsgApi(store, undefined);

    expect(sendMsg)
      .toHaveBeenCalledWith('');
  });
});

describe('identify', () => {
  let store;

  /* eslint-disable no-console */
  beforeEach(() => {
    store = createStore();
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

      apis.identifyApi(store, params);
    });

    it('calls identify and chat setUser', () => {
      expect(beacon.identify)
        .toHaveBeenCalledWith(params);
      expect(identity.setUserIdentity)
        .toHaveBeenCalledWith(params.name, params.email);
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

      apis.identifyApi(store, params);
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

      apis.identifyApi(store, params);
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

      apis.identifyApi(store, params);
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
  let store;

  describe('when the active embed is not zopim chat', () => {
    beforeEach(() => {
      store = createStore();
      store.dispatch = jest.fn();
      baseActions.openReceived = jest.fn();
      setActiveEmbed('something');
      apis.openApi(store);
    });

    it('dispatches the openReceived action', () => {
      expect(baseActions.openReceived).toHaveBeenCalled();
      expect(mediator.channel.broadcast).not.toHaveBeenCalledWith('zopimChat.show');
    });
  });

  describe('when the active embed is zopim chat', () => {
    beforeEach(() => {
      store = createStore();
      store.dispatch = jest.fn();
      baseActions.openReceived = jest.fn();
      setActiveEmbed('zopimChat');
      apis.openApi(store);
    });

    it('broadcasts "zopimChat.show" on mediator', () => {
      expect(baseActions.openReceived).not.toHaveBeenCalled();
      expect(mediator.channel.broadcast).toHaveBeenCalledWith('zopimChat.show');
    });
  });
});

describe('closeApi', () => {
  let store;

  describe('when the active embed is not zopim chat', () => {
    beforeEach(() => {
      store = createStore();
      store.dispatch = jest.fn();
      baseActions.closeReceived = jest.fn();
      setActiveEmbed('not zopim');
      apis.closeApi(store);
    });

    it('dispatches only closedReceived action', async () => {
      expect(mediator.channel.broadcast).not.toHaveBeenCalledWith('zopimChat.hide');
      expect(baseActions.closeReceived).toHaveBeenCalled();
    });
  });

  describe('when the active embed is zopim chat', () => {
    beforeEach(() => {
      store = createStore();
      store.dispatch = jest.fn();
      baseActions.closeReceived = jest.fn();
      setActiveEmbed('zopimChat');
      apis.closeApi(store);
    });

    it('dispatches the closedReceived action and broadcasts "zopimChat.hide" on mediator', () => {
      expect(baseActions.closeReceived).toHaveBeenCalled();
      expect(mediator.channel.broadcast).toHaveBeenCalledWith('zopimChat.hide');
    });
  });
});

describe('toggleApi', () => {
  let store;
  const setupTestData = (activeEmbed) => {
    setActiveEmbed(activeEmbed);
    apis.toggleApi(store);
  };

  describe('when the active embed is not zopim chat', () => {
    beforeEach(() => {
      store = createStore();

      store.dispatch = jest.fn();
      setupTestData('totallyNotZopim');
    });

    it('only dispatches the toggleReceived action', () => {
      expect(store.dispatch)
        .toHaveBeenCalledWith({ type: baseActionTypes.TOGGLE_RECEIVED });

      expect(mediator.channel.broadcast).not.toHaveBeenCalled();
    });
  });

  describe('when the active embed is zopim chat', () => {
    beforeEach(() => {
      store = createStore();

      store.dispatch = jest.fn();
      setupTestData('zopimChat');
    });

    it('only broadcasts "zopimChat.toggle" on mediator', () => {
      expect(store.dispatch).not.toHaveBeenCalled();

      expect(mediator.channel.broadcast)
        .toHaveBeenCalledWith('zopimChat.toggle');
    });
  });
});

test('closeApi dispatches the closeReceived action', () => {
  const store = createStore();

  store.dispatch = jest.fn();
  baseActions.closeReceived = jest.fn();
  apis.closeApi(store);

  expect(baseActions.closeReceived)
    .toHaveBeenCalled();
});

describe('setLocale', () => {
  beforeEach(() => {
    i18n.init(createStore());
    apis.setLocaleApi('en');
  });

  it('calls mediator', () => {
    expect(mediator.channel.broadcast)
      .toHaveBeenCalledWith('.onSetLocale');
  });
});

describe('updateSettingsApi', () => {
  let spy, store;

  beforeEach(() => {
    spy = jest.spyOn(settingsActions, 'updateSettings')
      .mockImplementation(mockAction);
    store = createStore();

    store.dispatch = jest.fn();
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('dispatches the updateSettings action', () => {
    apis.updateSettingsApi(store);

    expect(store.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

describe('logoutApi', () => {
  const logoutValue = Date.now(),
    chatLogoutValue = Date.now(),
    resetValue = { type: 'API_RESET_WIDGET' };
  let baseSpy, chatSpy, resetSpy, store;

  beforeEach(() => {
    store = createStore();

    store.dispatch = jest.fn();
    const logout = jest.fn(() => logoutValue),
      chatLogout = jest.fn(() => chatLogoutValue),
      apiReset = jest.fn(() => resetValue);

    baseSpy = jest.spyOn(baseActions, 'logout').mockImplementation(logout);
    chatSpy = jest.spyOn(chatActions, 'chatLogout').mockImplementation(chatLogout);
    resetSpy = jest.spyOn(baseActions, 'apiResetWidget').mockImplementation(apiReset);

    apis.logoutApi(store);
  });

  afterEach(() => {
    baseSpy.mockRestore();
    chatSpy.mockRestore();
    resetSpy.mockRestore();
  });

  it('dispatches the chatLogout action', () => {
    expect(store.dispatch)
      .toHaveBeenCalledWith(chatLogoutValue);
  });

  it('dispatches the logout action', () => {
    expect(store.dispatch)
      .toHaveBeenCalledWith(logoutValue);
  });

  it('calls mediator with the expected broadcast', () => {
    expect(mediator.channel.broadcast)
      .toHaveBeenCalledWith('.logout');
  });

  it('dispatches apiResetWidget', () => {
    expect(store.dispatch).toHaveBeenCalledWith(resetValue);
  });
});

describe('setHelpCenterSuggestionsApi', () => {
  let spy,
    store;

  beforeEach(() => {
    store = createStore();

    store.dispatch = jest.fn();
    spy = jest.spyOn(hcActions, 'setContextualSuggestionsManually')
      .mockImplementation(mockAction);
  });

  afterEach(() => spy.mockRestore());

  it('dispatches the setContextualSuggestionsManually action', () => {
    apis.setHelpCenterSuggestionsApi(store, { y: 1 });

    expect(store.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

test('prefill dispatches the prefillReceived action', () => {
  const store = createStore();

  store.dispatch = jest.fn();
  apis.prefill(store, { name: 'Wayne', email: 'w@a.com' });

  expect(store.dispatch)
    .toHaveBeenCalledWith(expect.objectContaining(
      { type: baseActionTypes.PREFILL_RECEIVED }
    ));
});

describe('hideApi', () => {
  let spy,
    store;

  beforeEach(() => {
    store = createStore();

    store.dispatch = jest.fn();
    spy = jest.spyOn(baseActions, 'hideRecieved')
      .mockImplementation(mockAction);
  });

  afterEach(() => spy.mockRestore());

  describe('when widget is open',() => {
    beforeEach(() => {
      baseSelectors.getWidgetShown = jest.fn().mockReturnValue(true);
    });
    it('dispatches the hideReceived action', () => {
      apis.hideApi(store);

      expect(store.dispatch)
        .toHaveBeenCalledWith(mockActionValue);
    });
  });

  describe('when widget is closed',() => {
    beforeEach(() => {
      baseSelectors.getWidgetShown = jest.fn().mockReturnValue(false);
    });
    it('dispatches the hideReceived action', () => {
      apis.hideApi(store);

      expect(store.dispatch)
        .not.toHaveBeenCalled();
    });
  });
});

test('showApi dispatches the showReceived action', () => {
  const store = createStore();

  store.dispatch = jest.fn();

  apis.showApi(store);

  expect(store.dispatch)
    .toHaveBeenCalledWith(expect.objectContaining(
      { type: baseActionTypes.SHOW_RECEIVED }
    ));
});

test('clearFormState dispatches the apiClearform action', () => {
  const store = createStore();

  store.dispatch = jest.fn();

  apis.clearFormState(store);

  expect(store.dispatch)
    .toHaveBeenCalledWith(expect.objectContaining(
      { type: baseActionTypes.API_CLEAR_FORM }
    ));
});

describe('updatePathApi', () => {
  let spy,
    store;

  beforeEach(() => {
    spy = jest.spyOn(chatActions, 'sendVisitorPath')
      .mockImplementation(mockAction);
    store = createStore();
    store.dispatch = jest.fn();
    apis.updatePathApi(store, 'hello');
  });

  afterEach(() => spy.mockRestore());

  it('calls sendVisitorPath with the argument', () => {
    expect(mockAction)
      .toHaveBeenCalledWith('hello');
  });

  it('dispatches the sendVisitorPath action', () => {
    expect(store.dispatch)
      .toHaveBeenCalledWith(mockActionValue);
  });
});

test('displayApi calls getWidgetDisplayInfo', () => {
  const store = createStore();

  expect(apis.displayApi(store))
    .toEqual('hidden');

  store.dispatch({ type: baseActionTypes.UPDATE_ACTIVE_EMBED, payload: 'helpCenterForm' });
  store.dispatch({ type: baseActionTypes.BOOT_UP_TIMER_COMPLETE });
  store.dispatch({ type: baseActionTypes.LAUNCHER_CLICKED });

  expect(apis.displayApi(store))
    .toEqual('helpCenter');
});

test('isChattingApi', () => {
  const store = createStore();

  expect(apis.isChattingApi(store))
    .toEqual(false);

  store.dispatch({
    type: chatActionTypes.IS_CHATTING,
    payload: true
  });

  expect(apis.isChattingApi(store))
    .toEqual(true);
});

test('getDepartmentApi', () => {
  const store = createStore();

  expect(apis.getDepartmentApi(store, 'yeetDepartment'))
    .not.toBeDefined();
  expect(apis.getDepartmentApi(store, 11))
    .not.toBeDefined();
  expect(apis.getDepartmentApi(store, 'blerg'))
    .not.toBeDefined();
  expect(apis.getDepartmentApi(store, 1000))
    .not.toBeDefined();

  store.dispatch({
    type: chatActionTypes.SDK_DEPARTMENT_UPDATE,
    payload: { detail: { id: 10, name: 'yeetDepartment' } }
  });

  store.dispatch({
    type: chatActionTypes.SDK_DEPARTMENT_UPDATE,
    payload: { detail: { id: 11, name: 'notYeetDepartment' } }
  });

  expect(apis.getDepartmentApi(store, 'yeetDepartment'))
    .toEqual({ 'id': 10, 'name': 'yeetDepartment' });
  expect(apis.getDepartmentApi(store, 11))
    .toEqual({ 'id': 11, 'name': 'notYeetDepartment' });
  expect(apis.getDepartmentApi(store, 'blerg'))
    .not.toBeDefined();
  expect(apis.getDepartmentApi(store, 1000))
    .not.toBeDefined();
});

test('getAllDepartmentsApi', () => {
  const store = createStore();

  expect(apis.getAllDepartmentsApi(store, 123).length)
    .toEqual(0);

  store.dispatch({
    type: chatActionTypes.SDK_DEPARTMENT_UPDATE,
    payload: { detail: { id: 10, name: ['yeetDepartment'] } }
  });

  expect(apis.getAllDepartmentsApi(store, 123))
    .toEqual([{ 'id': 10, 'name': ['yeetDepartment'] }]);
});

describe('onApi', () => {
  let on,
    callback,
    store;

  beforeEach(() => {
    store = createStore();
    callback = jest.fn(() => 123);
    on = apis.onApiObj();
  });

  test('if no callback is passed, do nothing', () => {
    const dispatch = store.dispatch;

    store.dispatch = jest.fn();
    on[constants.API_ON_CLOSE_NAME](store, 123);

    expect(store.dispatch)
      .not.toHaveBeenCalled();
    store.dispatch = dispatch;
  });

  describe('callback for API_ON_OPEN_NAME', () => {
    test('callback fired when open event is fired', async () => {
      on[constants.API_ON_OPEN_NAME](store, callback);

      expect(callback).not.toHaveBeenCalled();
      callbacks.fireFor(eventConstants.WIDGET_OPENED_EVENT);

      await wait(() => {
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  describe('callback for API_ON_CLOSE_NAME', () => {
    test('callback fired when close event is fired', async () => {
      on[constants.API_ON_CLOSE_NAME](store, callback);

      expect(callback).not.toHaveBeenCalled();
      callbacks.fireFor(eventConstants.WIDGET_CLOSED_EVENT);

      await wait(() => {
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  test('callback for API_ON_CHAT_CONNECTED_NAME', async () => {
    on.chat[constants.API_ON_CHAT_CONNECTED_NAME](store, callback);

    expect(callback).not.toHaveBeenCalled();
    callbacks.fireFor(eventConstants.CHAT_CONNECTED_EVENT);

    await wait(() => {
      expect(callback).toHaveBeenCalled();
    });
  });

  test('callback for API_ON_CHAT_END_NAME', async () => {
    on.chat[constants.API_ON_CHAT_END_NAME](store, callback);

    expect(callback).not.toHaveBeenCalled();
    callbacks.fireFor(eventConstants.CHAT_ENDED_EVENT);

    await wait(() => {
      expect(callback).toHaveBeenCalled();
    });
  });

  test('callback for API_ON_CHAT_START_NAME', async () => {
    on.chat[constants.API_ON_CHAT_START_NAME](store, callback);

    expect(callback).not.toHaveBeenCalled();
    callbacks.fireFor(eventConstants.CHAT_STARTED_EVENT);

    await wait(() => {
      expect(callback).toHaveBeenCalled();
    });
  });

  test('callback for API_ON_CHAT_STATUS_NAME', async () => {
    on.chat[constants.API_ON_CHAT_STATUS_NAME](store, callback);

    expect(callback).not.toHaveBeenCalled();
    store.dispatch({ type: chatActionTypes.SDK_ACCOUNT_STATUS, payload: { detail: 'yeetStat' } });
    callbacks.fireFor(eventConstants.CHAT_STATUS_EVENT);

    await wait(() => {
      expect(callback).toHaveBeenCalledWith('yeetStat');
    });
  });

  test('callback for API_ON_CHAT_UNREAD_MESSAGES_NAME', async () => {
    on.chat[constants.API_ON_CHAT_UNREAD_MESSAGES_NAME](store, callback);

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
    callbacks.fireFor(eventConstants.CHAT_UNREAD_MESSAGES_EVENT);

    await wait(() => {
      expect(callback).toHaveBeenCalledWith(1);
    });
  });

  test('callback for API_ON_CHAT_DEPARTMENT_STATUS', async () => {
    on.chat[constants.API_ON_CHAT_DEPARTMENT_STATUS](store, callback);

    expect(callback).not.toHaveBeenCalled();
    store.dispatch({ type: chatActionTypes.SDK_DEPARTMENT_UPDATE, payload: { detail: { id: 1 } } });
    callbacks.fireFor(eventConstants.CHAT_DEPARTMENT_STATUS_EVENT, [{ id: 1 }]);

    await wait(() => {
      expect(callback).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
