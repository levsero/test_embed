describe('submitTicket reducer formState', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState,
    state;

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
    const expected = {
      name: '',
      subject: '',
      email: '',
      description: ''
    };

    it('is set to an object with expected structure', () => {
      expect(initialState)
        .toEqual(expected);
    });
  });

  describe('when an FORM_ON_CHANGE action is dispatched', () => {
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

    it('sets the state to the payload merged with the initial state', () => {
      expect(state)
        .toEqual({
          ...mockFormState,
          subject: '',
          description: ''
        });
    });
  });

  describe('when an PREFILL_RECEIVED action is dispatched', () => {
    const mockFormState = {
      name: 'Gandalf',
      email: 'abc@123.com'
    };
    const initialFormState = {
      description: 'YOU SHALL NOT PASS'
    };

    beforeEach(() => {
      state = reducer(initialFormState, {
        type: baseActionTypes.PREFILL_RECEIVED,
        payload: { prefillValues: mockFormState }
      });
    });

    it('appends the state to the payload', () => {
      expect(state)
        .toEqual(_.extend(mockFormState, initialFormState));
    });
  });

  describe('when an API_CLEAR_FORM action is dispatched', () => {
    beforeEach(() => {
      const mockState = {
        name: 'Frodo Baggins',
        subject: 'the one ring',
        email: 'frodo@theshire.com',
        description: 'how to get to mordor?'
      };

      state = reducer(mockState, {
        type: baseActionTypes.API_CLEAR_FORM
      });
    });

    it('resets the formState to initialState', () => {
      expect(state).toEqual(initialState);
    });
  });
});
