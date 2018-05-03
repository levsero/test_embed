describe('chat reducer chatHistory hasMore', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-history/has-more');
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
      it('is set to false', () => {
        expect(initialState)
          .toEqual(false);
      });
    });

    describe('when a HISTORY_REQUEST_SUCCESS action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.HISTORY_REQUEST_SUCCESS,
          payload: { has_more: true }
        });
      });

      it('sets the state to the has_more payload', () => {
        expect(state)
          .toEqual(true);
      });
    });
  });
});
