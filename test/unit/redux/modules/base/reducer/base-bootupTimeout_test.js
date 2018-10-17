describe('base bootupTimeout', () => {
  let reducer,
    initialState,
    actionTypes;

  beforeAll(() => {
    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-bootupTimeout');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    initialState = reducer(undefined, { type: false});
    actionTypes = requireUncached(actionTypesPath);
  });

  describe('initial state', () => {
    it('is set to false', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe('when an BOOT_UP_TIMER_COMPLETE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.BOOT_UP_TIMER_COMPLETE,
      });
    });

    it('returns true', () => {
      expect(state)
        .toEqual(true);
    });
  });
});
