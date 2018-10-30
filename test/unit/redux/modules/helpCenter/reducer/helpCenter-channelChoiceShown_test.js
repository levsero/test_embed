describe('helpCenter reducer channelChoiceShown', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-channelChoiceShown');
    const actionTypesPath = buildSrcPath('redux/modules/helpCenter/helpCenter-action-types');
    const baseActionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
    baseActionTypes = requireUncached(baseActionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to false', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe('when an CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN,
        payload: true
      });
    });

    it('sets the state to the article passed from the payload', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(true, {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES,
        payload: true
      });
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual(false);
    });
  });
});
