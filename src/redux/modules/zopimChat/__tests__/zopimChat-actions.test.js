import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../zopimChat-actions';
import * as types from '../zopimChat-action-types';
import * as baseTypes from 'src/redux/modules/base/base-action-types';
import * as selectors from 'src/redux/modules/selectors';
import { mediator } from 'service/mediator';

jest.mock('service/mediator');

const mockStore = configureMockStore([thunk]);

test('updateZopimChatStatus dispatches expected action', () => {
  const expected = {
    type: types.ZOPIM_CHAT_ON_STATUS_UPDATE,
    payload: 'blah'
  };

  expect(actions.updateZopimChatStatus('blah'))
    .toEqual(expected);
});

test('zopimHide dispatches expected action', () => {
  const expected = {
    type: types.ZOPIM_HIDE
  };

  expect(actions.zopimHide())
    .toEqual(expected);
});

test('zopimShow dispatches expected action', () => {
  const expected = {
    type: types.ZOPIM_SHOW
  };

  expect(actions.zopimShow())
    .toEqual(expected);
});

test('zopimConnectionUpdate dispatches expected action', () => {
  const expected = {
    type: types.ZOPIM_CONNECTED
  };

  expect(actions.zopimConnectionUpdate())
    .toEqual(expected);
});

test('zopimIsChatting dispatches expected action', () => {
  const expected = {
    type: types.ZOPIM_IS_CHATTING
  };

  expect(actions.zopimIsChatting())
    .toEqual(expected);
});

test('zopimChatGoneOffline dispatches expected action', () => {
  const expected = {
    type: types.ZOPIM_CHAT_GONE_OFFLINE
  };

  expect(actions.zopimChatGoneOffline())
    .toEqual(expected);
});

test('zopimOpen dispatches expected action', () => {
  const expected = {
    type: types.ZOPIM_ON_OPEN
  };

  expect(actions.zopimOpen())
    .toEqual(expected);
});

test('zopimClose dispatches expected action', () => {
  const expected = {
    type: types.ZOPIM_ON_CLOSE
  };

  expect(actions.zopimClose())
    .toEqual(expected);
});

test('zopimOnClose dispatches expected action', () => {
  const store = mockStore({});

  store.dispatch(actions.zopimOnClose());
  expect(store.getActions())
    .toEqual([
      { type: types.ZOPIM_ON_CLOSE },
      { type: baseTypes.EXECUTE_API_ON_CLOSE_CALLBACK }
    ]);
});

describe('zopimProactiveMessageRecieved', () => {
  afterEach(() => {
    selectors.getWebWidgetVisible.mockRestore();
  });

  it('dispatches expected action when web widget is not visible', () => {
    const store = mockStore({});

    jest.spyOn(selectors, 'getWebWidgetVisible').mockReturnValue(false);
    store.dispatch(actions.zopimProactiveMessageRecieved());
    expect(store.getActions())
      .toEqual([
        {
          type: baseTypes.UPDATE_ACTIVE_EMBED,
          payload: 'zopimChat'
        }
      ]);
    expect(mediator.channel.broadcast)
      .toHaveBeenCalledWith('zopimChat.show');
  });

  it('does nothing when web widget is visible', () => {
    const store = mockStore({});

    jest.spyOn(selectors, 'getWebWidgetVisible').mockReturnValue(true);
    store.dispatch(actions.zopimProactiveMessageRecieved());
    expect(store.getActions())
      .toEqual([]);
    expect(mediator.channel.broadcast)
      .not.toHaveBeenCalledWith('zopimChat.show');
  });
});
