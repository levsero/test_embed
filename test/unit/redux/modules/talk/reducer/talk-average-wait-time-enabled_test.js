describe('talk reducer average wait time enabled', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-average-wait-time-enabled');
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
      it('averageWaitTimeEnabled is set to false', () => {
        expect(initialState)
          .toBe(false);
      });
    });

    describe('when a UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED,
          payload: true
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(true);
      });
    });
  });
});
