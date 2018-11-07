import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore,
  mockWidgetVisible;

const updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed').and.returnValue({ type: 'someActionType' });
const executeApiOnCloseCallbackSpy = jasmine.createSpy('executeApiOnCloseCallback').and.returnValue({ type: 'someActionType' });
const broadcastSpy = jasmine.createSpy('channel.broadcast');
const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('zopimChat redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const actionsPath = buildSrcPath('redux/modules/zopimChat');
    const actionTypesPath = buildSrcPath('redux/modules/zopimChat/zopimChat-action-types');

    initMockRegistry({
      'src/redux/modules/selectors': {
        getWebWidgetVisible: () => mockWidgetVisible
      },
      'src/redux/modules/base': {
        updateActiveEmbed: updateActiveEmbedSpy,
        executeApiOnCloseCallback: executeApiOnCloseCallbackSpy
      },
      'service/mediator': {
        mediator: {
          channel: {
            broadcast: broadcastSpy
          }
        }
      }
    });

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({ zopimChat: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();

    updateActiveEmbedSpy.calls.reset();
    broadcastSpy.calls.reset();
  });

  describe('updateZopimChatStatus', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateZopimChatStatus('online'));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type ZOPIM_CHAT_ON_STATUS_UPDATE', () => {
      expect(action.type)
        .toEqual(actionTypes.ZOPIM_CHAT_ON_STATUS_UPDATE);
    });

    it('has the status in the payload', () => {
      expect(action.payload)
        .toEqual('online');
    });
  });

  describe('zopimHide', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.zopimHide());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type ZOPIM_HIDE', () => {
      expect(action.type)
        .toEqual(actionTypes.ZOPIM_HIDE);
    });
  });

  describe('zopimShow', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.zopimShow());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type ZOPIM_SHOW', () => {
      expect(action.type)
        .toEqual(actionTypes.ZOPIM_SHOW);
    });
  });

  describe('zopimConnectionUpdate', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.zopimConnectionUpdate());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type ZOPIM_CONNECTED', () => {
      expect(action.type)
        .toEqual(actionTypes.ZOPIM_CONNECTED);
    });
  });

  describe('zopimOnClose', () => {
    let dispatchedActions;

    beforeEach(() => {
      mockStore.dispatch(actions.zopimOnClose());
      dispatchedActions = mockStore.getActions();
    });

    it('dispatches an action of type ZOPIM_ON_CLOSE', () => {
      expect(dispatchedActions[0].type)
        .toEqual(actionTypes.ZOPIM_ON_CLOSE);
    });

    it('dispatches executeApiOnCloseCallback', () => {
      expect(executeApiOnCloseCallbackSpy)
        .toHaveBeenCalled();
    });
  });

  describe('zopimIsChatting', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.zopimIsChatting());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type ZOPIM_IS_CHATTING', () => {
      expect(action.type)
        .toEqual(actionTypes.ZOPIM_IS_CHATTING);
    });
  });

  describe('zopimEndChat', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.zopimEndChat());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type ZOPIM_END_CHAT', () => {
      expect(action.type)
        .toEqual(actionTypes.ZOPIM_END_CHAT);
    });
  });

  describe('zopimProactiveMessageRecieved', () => {
    beforeEach(() => {
      mockStore.dispatch(actions.zopimProactiveMessageRecieved());
    });

    describe('when the widget is not visible', () => {
      beforeAll(() => {
        mockWidgetVisible = false;
      });

      it('dispatches updateActiveEmbed with zopimChat', () => {
        expect(updateActiveEmbedSpy)
          .toHaveBeenCalledWith('zopimChat');
      });

      it('calls mediator broadcast with zopimChat.show', () => {
        expect(broadcastSpy)
          .toHaveBeenCalledWith('zopimChat.show');
      });
    });

    describe('when the widget is visible', () => {
      beforeAll(() => {
        mockWidgetVisible = true;
      });

      it('does not dispatch updateActiveEmbed', () => {
        expect(updateActiveEmbedSpy)
          .not.toHaveBeenCalled();
      });

      it('does not call mediator broadcast', () => {
        expect(broadcastSpy)
          .not.toHaveBeenCalled();
      });
    });
  });
});
