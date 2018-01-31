describe('base reducer activeEmbed', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-active-embed');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to a empty string', () => {
      expect(initialState)
        .toEqual('');
    });
  });

  describe(`when an UPDATE_ACTIVE_EMBED action is dispatched`, () => {
    let activeEmbed,
      state;

    beforeEach(() => {
      activeEmbed = 'helpCenter';

      state = reducer(initialState, {
        type: actionTypes.UPDATE_ACTIVE_EMBED,
        payload: activeEmbed
      });
    });

    it('sets the action payload as the state', () => {
      expect(state)
        .toEqual(activeEmbed);
    });
  });
});
