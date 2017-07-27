import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('helpCenter actions', () => {
  beforeEach(() => {
    mockery.enable();

    const actionsPath = buildSrcPath('redux/modules/helpCenter');
    const actionTypesPath = buildSrcPath('redux/modules/helpCenter/helpCenter-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({ helpCenter: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('updateHelpCenterAuth', () => {
    let bool,
      action;

    beforeEach(() => {
      bool = true;
      mockStore.dispatch(actions.updateHelpCenterAuth(bool));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_HELP_CENTER_AUTHENTICATED', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_HELP_CENTER_AUTHENTICATED);
    });

    it('has an authenticated property in the payload', () => {
      expect(action.payload)
        .toEqual(bool);
    });
  });
});
