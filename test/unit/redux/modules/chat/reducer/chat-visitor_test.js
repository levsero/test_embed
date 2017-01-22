describe('chat reducer visitor', () => {
  let reducer,
    actionTypes;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-visitor');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      beforeEach(() => {
        state = reducer(undefined, { type: 'NOTHING' });
      });

      it('is set to an empty object', () => {
        expect(state)
          .toEqual({});
      });
    });
  });
});
