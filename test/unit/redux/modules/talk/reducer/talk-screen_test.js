describe('talk reducer screen', () => {
  let reducer,
    actionTypes,
    screenTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-screen');
    const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');
    const screenTypesPath = buildSrcPath('redux/modules/talk/talk-screen-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);
    screenTypes = requireUncached(screenTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('screen is set to CALLBACK_ONLY_SCREEN', () => {
        expect(initialState)
          .toBe(screenTypes.CALLBACK_ONLY_SCREEN);
      });
    });

    describe('when a UPDATE_SCREEN action is dispatched', () => {
      let screen;

      beforeEach(() => {
        screen = screenTypes.SUCCESS_NOTIFICATION_SCREEN;

        state = reducer(initialState, {
          type: actionTypes.UPDATE_SCREEN,
          payload: screen
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(screen);
      });
    });
  });
});
