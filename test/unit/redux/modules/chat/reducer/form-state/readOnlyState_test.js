describe('chat reducer readOnlyState', () => {
  let reducer,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/form-state/readOnlyState');
    const baseActionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    baseActionTypes = requireUncached(baseActionTypesPath);
    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to an expected object', () => {
      const expected = {
        name: false,
        email: false,
        phone: false
      };

      expect(initialState)
        .toEqual(jasmine.objectContaining(expected));
    });
  });

  describe('when an PREFILL_RECEIVED action is dispatched', () => {
    let state;

    beforeEach(() => {
      const payload = {
        isReadOnly: { name: false, email: true }
      };

      state = reducer(initialState, {
        type: baseActionTypes.PREFILL_RECEIVED,
        payload
      });
    });

    it('merges the payload with the previous state', () => {
      const expected = {
        name: false,
        email: true,
        phone: false
      };

      expect(state)
        .toEqual(expected);
    });
  });
});
