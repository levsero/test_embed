describe('chat concierge reducer', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/chat/chat-concierge');
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
      let payload,
        state;

      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_SETTINGS,
          payload: payload
        });
      });

      describe('when valid properties are set', () => {
        const mockState = {
          avatarPath: 'https://i.imgur.com/3mZBYfn.jpg',
          title: 'Some title',
          name: 'Mr McGee'
        };

        beforeAll(() => {
          payload = {
            webWidget: {
              chat: {
                concierge: mockState
              }
            }
          };
        });

        it('adds the payload data', () => {
          expect(state).toEqual(mockState);
        });
      });

      describe('when an irrelevant property is set', () => {
        beforeAll(() => {
          payload = {
            whatevs: { foo: 'bar' }
          };
        });

        it('keeps its initial state', () => {
          expect(state).toEqual(initialState);
        });
      });
    });
  });
});
