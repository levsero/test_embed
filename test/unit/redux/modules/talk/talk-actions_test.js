import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  screenTypes,
  mockStore;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('chat redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const actionsPath = buildSrcPath('redux/modules/talk');
    const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');
    const screenTypesPath = buildSrcPath('redux/modules/talk/talk-screen-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);
    mockery.registerAllowable(screenTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);
    screenTypes = requireUncached(screenTypesPath);

    mockStore = createMockStore({
      talk: {
      }
    });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('updateTalkScreen', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateTalkScreen(screenTypes.SUCCESS_NOTIFICATION_SCREEN));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_SCREEN', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_SCREEN);
    });

    it('dispatches an action with the screen', () => {
      expect(action.payload)
        .toEqual(screenTypes.SUCCESS_NOTIFICATION_SCREEN);
    });
  });

  describe('updateTalkCallMeForm', () => {
    let action,
      formState;

    beforeEach(() => {
      formState = { phone: '+61412345678' };
      mockStore.dispatch(actions.updateTalkCallMeForm(formState));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_CALL_ME_FORM', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_CALL_ME_FORM);
    });

    it('dispatches an action with the formState', () => {
      expect(action.payload)
        .toEqual(formState);
    });
  });

  describe('updateTalkPhoneNumber', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateTalkPhoneNumber('+61412345678'));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_PHONE_NUMBER', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_PHONE_NUMBER);
    });

    it('dispatches an action with the phone number', () => {
      expect(action.payload)
        .toEqual('+61412345678');
    });
  });
});
