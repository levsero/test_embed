describe('chat reducer account_status', () => {
  let reducer,
    actionTypes;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-account-status');
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

      it('is set to an empty string', () => {
        expect(state)
          .toEqual('');
      });
    });

    describe(`when a SDK_ACCOUNT_STATUS action is dispatched`, () => {
      let accountStatus = 'online';

      beforeEach(() => {
        state = reducer(undefined, {
          type: actionTypes.SDK_ACCOUNT_STATUS,
          payload: {
            detail: accountStatus
          }
        });
      })

      it('sets the action payload.detail as the state', () => {
        expect(state)
          .toEqual(accountStatus);
      });
    });
  });
});
