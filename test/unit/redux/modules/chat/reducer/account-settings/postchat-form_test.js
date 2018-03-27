describe('chat reducer accountSettings postchatForm', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/account-settings/postchat-form');
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
        const expected = { header: '', message: '' };

        expect(initialState)
          .toEqual(expected);
      });
    });

    describe('when a GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS action is dispatched', () => {
      let settings,
        mockHeader,
        mockMessage;

      describe('with a payload containing strings for the header and message', () => {
        beforeEach(() => {
          mockHeader = 'It was nice chatting with you!';
          mockMessage = 'Would you like to leave a comment?';

          const mockPostChatForm = {
            header: { toString: () => mockHeader },
            message: { toString: () => mockMessage }
          };

          settings = {
            forms: {
              post_chat_form: mockPostChatForm
            }
          };

          state = reducer(initialState, {
            type: actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
            payload: settings
          });
        });

        it('sets the action payload as the state', () => {
          const expected = {
            header: mockHeader,
            message: mockMessage
          };

          expect(state)
            .toEqual(expected);
        });
      });

      describe('with a payload containing null values for the header and message', () => {
        beforeEach(() => {
          mockHeader = null;
          mockMessage = null;

          const mockPostChatForm = {
            header: mockHeader ,
            message: mockMessage
          };

          settings = {
            forms: {
              post_chat_form: mockPostChatForm
            }
          };

          state = reducer(initialState, {
            type: actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
            payload: settings
          });
        });

        it('sets the header and message to empty strings in the state', () => {
          const expected = {
            header: '',
            message: ''
          };

          expect(state)
            .toEqual(expected);
        });
      });
    });
  });
});
