describe('chat reducer chatHistory requestStatus', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-history/request-status');
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
      it('is set to null', () => {
        expect(initialState)
          .toEqual(null);
      });
    });

    describe('when a HISTORY_REQUEST_SENT action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.HISTORY_REQUEST_SENT
        });
      });

      it('sets the state to pending', () => {
        expect(state)
          .toEqual('pending');
      });
    });

    describe('when a HISTORY_REQUEST_SUCCESS action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.HISTORY_REQUEST_SUCCESS
        });
      });

      it('sets the state to done', () => {
        expect(state)
          .toEqual('done');
      });
    });

    describe('when a HISTORY_REQUEST_FAILURE action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.HISTORY_REQUEST_FAILURE
        });
      });

      it('sets the state to fail', () => {
        expect(state)
          .toEqual('fail');
      });
    });
  });
});
