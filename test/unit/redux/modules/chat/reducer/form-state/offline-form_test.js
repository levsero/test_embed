describe('chat reducer formState offlineForm', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/form-state/offline-form');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');
    const baseActionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);
    baseActionTypes = requireUncached(baseActionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;
    const mockInitialState = {
      name: '',
      email: '',
      phone: '',
      message: '',
    };

    describe('initial state', () => {
      it('is set to an object with expected structure', () => {
        expect(initialState)
          .toEqual(mockInitialState);
      });
    });

    describe('when a CHAT_OFFLINE_FORM_CHANGED action is dispatched', () => {
      let mockFormState;

      beforeEach(() => {
        mockFormState = {
          name: 'Terence',
          phone: '123456789',
          email: 'foo@bar',
          message: 'fred'
        };

        state = reducer(initialState, {
          type: actionTypes.CHAT_OFFLINE_FORM_CHANGED,
          payload: mockFormState
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(mockFormState);
      });
    });

    describe('when a PREFILL_RECEIVED action is dispatched', () => {
      let mockFormState;

      beforeEach(() => {
        mockFormState = {
          name: 'Not Terence',
          email: 'foo@baz'
        };

        state = reducer({ phone: '12345678' }, {
          type: baseActionTypes.PREFILL_RECEIVED,
          payload: { prefillValues: mockFormState }
        });
      });

      it('adds the action payload to the state', () => {
        const expected = {
          name: 'Not Terence',
          email: 'foo@baz',
          phone: '12345678'
        };

        expect(state)
          .toEqual(expected);
      });
    });

    describe('when a OFFLINE_FORM_BACK_BUTTON_CLICKED action is dispatched', () => {
      let mockFormState;

      beforeEach(() => {
        mockFormState = {
          name: 'Terence',
          phone: '123456789',
          email: 'foo@bar',
          message: 'fred'
        };

        state = reducer(mockFormState, {
          type: actionTypes.OFFLINE_FORM_BACK_BUTTON_CLICKED
        });
      });

      it('clears the value of message', () => {
        const expected = {
          name: 'Terence',
          phone: '123456789',
          email: 'foo@bar',
          message: ''
        };

        expect(state)
          .toEqual(expected);
      });
    });

    describe('when an API_CLEAR_FORM action is dispatched', () => {
      beforeEach(() => {
        const mockState = {
          name: 'Frodo Baggins',
          phone: '123456789',
          email: 'frodo@theshire.com',
          message: 'one walk to rule them all'
        };

        state = reducer(mockState, {
          type: baseActionTypes.API_CLEAR_FORM
        });
      });

      it('resets the form state to initialState', () => {
        expect(state).toEqual(initialState);
      });
    });
  });
});
