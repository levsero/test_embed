describe('settings chat prechat form', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/chat/chat-prechat-form');
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
      it('an object with null values', () => {
        shallowObjectValuesNull(initialState);
      });
    });

    describe('when an UPDATE_SETTINGS action is dispatched', () => {
      let payload, state, mockState;

      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_SETTINGS,
          payload: payload
        });
      });

      describe('when valid properties are set', () => {
        beforeAll(() => {
          mockState = {
            departmentLabel: 'cool department',
            greeting: 'konichiha'
          };

          payload = {
            webWidget: {
              chat: {
                prechatForm: mockState
              }
            }
          };
        });

        it('updates the value', () => {
          expect(state).toEqual(mockState);
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
