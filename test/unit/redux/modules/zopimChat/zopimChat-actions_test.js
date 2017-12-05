import configureMockStore from 'redux-mock-store';

let actions,
  actionTypes,
  mockStore;

const createMockStore = configureMockStore();

describe('zopimChat redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const actionsPath = buildSrcPath('redux/modules/zopimChat');
    const actionTypesPath = buildSrcPath('redux/modules/zopimChat/zopimChat-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({ zopimChat: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
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
});
