describe('base reducer locale', () => {
  let actionTypes,
    reducer,
    initialState,
    state;

  beforeAll(() => {
    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-locale');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, {type: ''});
  });

  describe('initial state', () => {
    it('is set to defaults', () => {
      expect(initialState)
        .toEqual('');
    });
  });

  describe('when LOCALE_SET is passed', () => {
    beforeEach(() => {
      state = reducer(undefined, {
        type: actionTypes.LOCALE_SET,
        payload: 'ar'
      });
    });

    it('set to ar', () => {
      expect(state)
        .toEqual('ar');
    });
  });
});
