describe('base reducer queue', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-queue');
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
    it('is set to an empty object', () => {
      expect(initialState)
        .toEqual({});
    });
  });

  describe('when an UPDATE_QUEUE action is dispatched', () => {
    let action,
      state;

    beforeEach(() => {
      action = {
        type: actionTypes.UPDATE_QUEUE,
        payload: {
          someMethod: ['some', 'args']
        }
      };

      state = reducer(initialState, action);
    });

    it('contains the method call', () => {
      expect(state)
        .toEqual({
          someMethod: ['some', 'args']
        });
    });
  });

  describe('when an REMOVE_FROM_QUEUE action is dispatched', () => {
    let action,
      state;

    beforeEach(() => {
      initialState = {
        someMethod: ['some', 'args']
      };
      action = {
        type: actionTypes.REMOVE_FROM_QUEUE,
        payload: 'someMethod'
      };

      state = reducer(initialState, action);
    });

    it('does not contain the removed method call', () => {
      expect(state)
        .toEqual({});
    });
  });
});
