describe('chat reducer forcedStatus', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-forced-status');
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

    describe('when a API_FORCE_STATUS_CALLED action is dispatched', () => {
      let payload;

      describe('when status is online', () => {
        beforeEach(() => {
          payload = 'online';

          state = reducer(initialState, {
            type: actionTypes.API_FORCE_STATUS_CALLED,
            payload: payload
          });
        });

        it('sets state to online', () => {
          expect(state)
            .toEqual('online');
        });
      });

      describe('when status is offline', () => {
        beforeEach(() => {
          payload = 'offline';

          state = reducer(initialState, {
            type: actionTypes.API_FORCE_STATUS_CALLED,
            payload: payload
          });
        });

        it('sets state to offline', () => {
          expect(state)
            .toEqual('offline');
        });
      });
    });
  });
});
