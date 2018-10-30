import * as apis from '../apis';
import * as baseActionTypes from 'src/redux/modules/base/base-action-types';

const chatActions = require('src/redux/modules/chat/chat-actions');
const settingsActions = require('src/redux/modules/settings/settings-actions');
const baseActions = require('src/redux/modules/base/base-actions');
const hcActions = require('src/redux/modules/helpCenter/helpCenter-actions');
const mockStore = {
  dispatch: jest.fn()
};

jest.mock('service/mediator');
jest.mock('service/i18n');
jest.mock('src/redux/modules/selectors');
jest.mock('src/redux/modules/chat/chat-selectors');

import { mediator } from 'service/mediator';
import { i18n } from 'service/i18n';
import { getWidgetDisplayInfo } from 'src/redux/modules/selectors';
import { getIsChatting } from 'src/redux/modules/chat/chat-selectors';

const mockActionValue = Date.now();
const mockAction = jest.fn(() => mockActionValue);

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

test('openApi dispatches the openReceived action', () => {
  apis.openApi(mockStore);

  expect(mockStore.dispatch)
    .toHaveBeenCalledWith({ type: baseActionTypes.OPEN_RECEIVED });
});

test('closeApi dispatches the closeReceived action', () => {
  apis.closeApi(mockStore);

  expect(mockStore.dispatch)
    .toHaveBeenCalledWith({ type: baseActionTypes.CLOSE_RECEIVED });
});

describe('setLocale', () => {
  beforeEach(() => {
    apis.setLocaleApi('fdasfsd', 'en');
  });

  it('updates i18n', () => {
    expect(i18n.setLocale)
      .toHaveBeenCalledWith('en', true);
  });

  it('calls mediator and updates i18n', () => {
    expect(mediator.channel.broadcast)
      .toHaveBeenCalledWith('.onSetLocale', 'en');
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