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

    describe('initial state', () => {
      it('formState is set to an empty object', () => {
        expect(initialState)
          .toEqual({});
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

    describe('when a IDENTIFY_RECIEVED action is dispatched', () => {
      let mockFormState;

      beforeEach(() => {
        mockFormState = {
          name: 'Not Terence',
          email: 'foo@baz'
        };

        state = reducer({ phone: '12345678' }, {
          type: baseActionTypes.IDENTIFY_RECIEVED,
          payload: mockFormState
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
  });
});
