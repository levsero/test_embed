describe('submitTicket reducer formState', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/submitTicket/reducer/submitTicket-formState');
    const actionTypesPath = buildSrcPath('redux/modules/submitTicket/submitTicket-action-types');
    const baseActionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
    baseActionTypes = requireUncached(baseActionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to an empty object', () => {
      expect(initialState)
        .toEqual({});
    });
  });

  describe('when an FORM_ON_CHANGE action is dispatched', () => {
    let state;
    const mockFormState = {
      name: 'Gandalf',
      email: 'abc@123.com'
    };

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.FORM_ON_CHANGE,
        payload: mockFormState
      });
    });

    it('sets the state to the payload', () => {
      expect(state)
        .toEqual(mockFormState);
    });
  });

  describe('when an IDENTIFY_RECIEVED action is dispatched', () => {
    let state;
    const mockFormState = {
      name: 'Gandalf',
      email: 'abc@123.com'
    };
    const initialFormState = {
      description: 'YOU SHALL NOT PASS'
    };

    beforeEach(() => {
      state = reducer(initialFormState, {
        type: baseActionTypes.IDENTIFY_RECIEVED,
        payload: mockFormState
      });
    });

    it('appends the state to the payload', () => {
      expect(state)
        .toEqual(_.extend(mockFormState, initialFormState));
    });
  });
});
