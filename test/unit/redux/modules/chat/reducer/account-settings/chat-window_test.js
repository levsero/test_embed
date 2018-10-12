describe('chat reducer accountSettings chatWindow', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/account-settings/chat-window');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('sets the appropriate initial state', () => {
        const expected = { title: '' };

        expect(initialState)
          .toEqual(expected);
      });
    });

    describe('when a GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS action is dispatched', () => {
      let settings,
        mockTitle;

      describe('with a payload containing strings for the title', () => {
        beforeEach(() => {
          mockTitle = 'My custom title';

          const mockTitleBar = {
            title: { toString: () => mockTitle }
          };

          settings = {
            chat_window: {
              title_bar: mockTitleBar
            }
          };

          state = reducer(initialState, {
            type: actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
            payload: settings
          });
        });

        it('sets the action payload as the state', () => {
          const expected = {
            title: mockTitle
          };

          expect(state)
            .toEqual(expected);
        });
      });

      describe('with a payload containing null values for the header and message', () => {
        beforeEach(() => {
          mockTitle = null;

          const mockTitleBar = {
            title: mockTitle,
          };

          settings = {
            chat_window: {
              title_bar: mockTitleBar
            }
          };

          state = reducer(initialState, {
            type: actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
            payload: settings
          });
        });

        it('sets the title to empty string in the state', () => {
          const expected = {
            title: '',
          };

          expect(state)
            .toEqual(expected);
        });
      });
    });

    describe('when a UPDATE_PREVIEWER_SETTINGS action is dispatched', () => {
      let settings,
        mockTitle;

      beforeEach(() => {
        mockTitle = 'My custom title';

        const mockTitleBar = {
          title: { toString: () => mockTitle }
        };

        settings = {
          chat_window: {
            title_bar: mockTitleBar
          }
        };

        state = reducer(initialState, {
          type: actionTypes.UPDATE_PREVIEWER_SETTINGS,
          payload: settings
        });
      });

      it('sets the action payload as the state', () => {
        const expected = {
          title: mockTitle
        };

        expect(state)
          .toEqual(expected);
      });
    });
  });
});
