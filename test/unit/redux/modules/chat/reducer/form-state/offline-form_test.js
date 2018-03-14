describe('chat reducer formState offlineForm', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/form-state/offline-form');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

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
  });
});
