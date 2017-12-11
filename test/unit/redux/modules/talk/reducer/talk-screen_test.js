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

    describe('when a UPDATE_TALK_SCREEN action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_TALK_SCREEN,
          payload: screenTypes.CALL_ME_SCREEN
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(screenTypes.CALL_ME_SCREEN);
      });
    });

    describe('when a TALK_CALLBACK_SUCCESS action is dispatched and sent to talk screen reducer', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.TALK_CALLBACK_SUCCESS,
          payload: screenTypes.SUCCESS_NOTIFICATION_SCREEN
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(screenTypes.SUCCESS_NOTIFICATION_SCREEN);
      });
    });

    describe('when a TALK_CALLBACK_SUCCESS action is dispatched and sent to talk screen reducer', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.TALK_CALLBACK_SUCCESS,
          payload: screenTypes.SUCCESS_NOTIFICATION_SCREEN
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(screenTypes.SUCCESS_NOTIFICATION_SCREEN);
      });
    });
  });
});
