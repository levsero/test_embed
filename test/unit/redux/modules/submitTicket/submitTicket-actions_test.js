import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('submitTicket redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const actionsPath = buildSrcPath('redux/modules/submitTicket');
    const actionTypesPath = buildSrcPath('redux/modules/submitTicket/submitTicket-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({ submitTicket: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('handleFormChange', () => {
    let action;
    const mockFormState = {
      name: 'Gandalf',
      email: 'abc@123.com'
    };

    beforeEach(() => {
      mockStore.dispatch(actions.handleFormChange(mockFormState));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type FORM_ON_CHANGE', () => {
      expect(action.type)
        .toEqual(actionTypes.FORM_ON_CHANGE);
    });

    it('contains the form state as the payload', () => {
      expect(action.payload)
        .toEqual(mockFormState);
    });
  });
});
