describe('talk reducer average wait time', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-average-wait-time');
    const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');

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
      it('averageWaitTime is set to 0', () => {
        expect(initialState)
          .toBe('0');
      });
    });

    describe('when a UPDATE_AVERAGE_WAIT_TIME action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_AVERAGE_WAIT_TIME,
          payload: '1'
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual('1');
      });
    });
  });
});
