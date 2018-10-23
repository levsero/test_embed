describe('base reducer widget initialised', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-widget-initialised');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    actionTypes = requireUncached(actionTypesPath);
    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, {
      type: ''
    });
  });

  describe('initial state', () => {
    it('is set to defaults', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe('when WIDGET_INITALISED is passed', () => {
    let state;

    beforeEach(() => {
      state = reducer(undefined, {
        type: actionTypes.WIDGET_INITIALISED
      });
    });

    it('to return true', () => {
      expect(state)
        .toEqual(true);
    });
  });
});
