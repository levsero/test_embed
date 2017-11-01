describe('chat show contact details notification', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-show-contact-details-notification');
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
    const mockInitialState = false;

    describe('initial state', () => {
      it('is set to an expected object', () => {
        expect(initialState)
          .toEqual(mockInitialState);
      });
    });

    describe('when a TOGGLE_CONTACT_DETAILS_NOTIFICATION action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.TOGGLE_CONTACT_DETAILS_NOTIFICATION, payload: true };

        state = reducer(initialState, action);
      });

      it('updates the state with payload', () => {
        expect(state)
          .toEqual(true);
      });
    });
  });
});
