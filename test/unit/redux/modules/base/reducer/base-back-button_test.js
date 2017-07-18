describe('base reducer back button', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/back-button');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to false', () => {
      expect(initialState)
        .toEqual({ visible: false });
    });
  });

  describe(`when an UPDATE_BACK_BUTTON_VISIBILITY action is dispatched`, () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_BACK_BUTTON_VISIBILITY,
        payload: true
      });
    });

    it('sets the action payload as the state', () => {
      expect(state)
        .toEqual({ visible: true });
    });
  });
});
