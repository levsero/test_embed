describe('chat concierge avatar reducer', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/chat/chat-concierge-avatar');
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
        expect(initialState)
          .toBeNull();
      });
    });

    describe('when a UPDATE_SETTINGS action is dispatched', () => {
      let payload,
        state;

      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_SETTINGS,
          payload: payload
        });
      });

      describe('when the avatarPath is set', () => {
        beforeAll(() => {
          payload = {
            chat: {
              concierge: {
                avatarPath: 'https://i.imgur.com/3mZBYfn.jpg'
              }
            }
          };
        });

        it('adds a department with the payload data', () => {
          expect(state)
            .toEqual('https://i.imgur.com/3mZBYfn.jpg');
        });
      });

      describe('when the avatarPath is not set', () => {
        beforeAll(() => {
          payload = {
            whatevs: { }
          };
        });

        it('keeps its initial state', () => {
          expect(state)
            .toBeNull();
        });
      });
    });
  });
});
