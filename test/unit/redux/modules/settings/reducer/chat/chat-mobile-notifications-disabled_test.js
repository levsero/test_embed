describe('chat reducer mobile notifications disabled', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/chat/chat-mobile-notifications-disabled');
    const actionTypesPath = buildSrcPath('redux/modules/settings/settings-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to empty string', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe('when an UPDATE_SETTINGS action is dispatched', () => {
    let someSettings,
      state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_SETTINGS,
        payload: someSettings
      });
    });

    describe('when mobile notifications are set to true', () => {
      beforeAll(() => {
        someSettings = {
          webWidget: {
            chat: {
              notifications: {
                mobile: {
                  disable: true
                }
              }
            }
          }
        };
      });

      it('set the state to true', () => {
        expect(state)
          .toEqual(true);
      });
    });

    describe('when mobile notifications are set to false', () => {
      beforeAll(() => {
        someSettings = {
          webWidget: {
            chat: {
              notifications: {
                mobile: {
                  disable: false
                }
              }
            }
          }
        };
      });

      it('sets the state to false', () => {
        expect(state)
          .toEqual(false);
      });
    });
  });
});
