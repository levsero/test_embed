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

    describe('when a UPDATE_ACCOUNT_SETTINGS action is dispatched', () => {
      let settings,
        mockHeader,
        mockMessage;

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
          type: actionTypes.UPDATE_ACCOUNT_SETTINGS,
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
  });
});
