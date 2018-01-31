describe('chat reducer userSettings sound', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/user-settings/sound');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(true, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('is set to true', () => {
        expect(initialState)
          .toEqual(true);
      });
    });

    describe('when a SOUND_ICON_CLICKED action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.SOUND_ICON_CLICKED,
          payload: { sound: false }
        });
      });

      it('updates the state with the sound property from the payload', () => {
        expect(state)
          .toEqual(false);
      });
    });
  });
});
