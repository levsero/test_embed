describe('settings chat title', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/chat/chat-title');
    const actionTypesPath = buildSrcPath('redux/modules/settings/settings-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    describe('initial state', () => {
      it('is set to null', () => {
        expect(initialState).toBeNull();
      });
    });

    describe('when an UPDATE_SETTINGS action is dispatched', () => {
      let payload, state;

      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_SETTINGS,
          payload: payload
        });
      });

      describe('when valid properties are set', () => {
        beforeAll(() => {
          payload = {
            webWidget: {
              chat: {
                title: 'some brilliantly witty title'
              }
            }
          };
        });

        it('updates the value', () => {
          expect(state).toEqual('some brilliantly witty title');
        });
      });

      describe('when invalid properties are set', () => {
        beforeAll(() => {
          payload = {
            webWidget: {
              yeah: 'nah'
            }
          };
        });

        it('does nothing', () => {
          expect(state).toEqual(initialState);
        });
      });
    });
  });
});
