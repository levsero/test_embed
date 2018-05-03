import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('settings redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const actionsPath = buildSrcPath('redux/modules/settings');
    const actionTypesPath = buildSrcPath('redux/modules/settings/settings-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({ settings: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('updateSettingsChatSuppress', () => {
    let action;

    beforeEach(() => {
      const suppress = true;

      mockStore.dispatch(actions.updateSettingsChatSuppress(suppress));
      action = mockStore.getActions()[0];
    });

    it('updates settings for chat suppress to true', () => {
      const expected = {
        type: actionTypes.UPDATE_SETTINGS_CHAT_SUPPRESS,
        payload: true
      };

      expect(action)
        .toEqual(expected);
    });
  });

  describe('updateSettings', () => {
    let action;
    const someSettings = {
      webWidget: {
        chat: {
          visitor: {
            departments: {
              department: 'yo'
            }
          }
        }
      }
    };

    beforeEach(() => {
      mockStore.dispatch(actions.updateSettings(someSettings));
      action = mockStore.getActions()[0];
    });

    it('updates settings for departments with expected values', () => {
      const expected = {
        type: actionTypes.UPDATE_SETTINGS,
        payload: someSettings
      };

      expect(action)
        .toEqual(expected);
    });
  });

  describe('resetSettingsChatSuppress', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.resetSettingsChatSuppress());
      action = mockStore.getActions()[0];
    });

    it('resets settings for chat suppress to its original state', () => {
      const expected = { type: actionTypes.RESET_SETTINGS_CHAT_SUPPRESS };

      expect(action)
        .toEqual(expected);
    });
  });
});
