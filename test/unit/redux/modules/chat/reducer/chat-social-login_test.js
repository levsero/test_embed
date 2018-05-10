describe('chat reducer socialLogin', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-social-login');
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
      it('is set to an expected default object', () => {
        const expected = {
          authenticated: false,
          authUrls: {},
          screen: '',
          avatarPath: ''
        };

        expect(initialState)
          .toEqual(expected);
      });
    });

    describe('when an action is dispatched', () => {
      let payload,
        action;

      beforeEach(() => {
        state = reducer(initialState, action);
      });

      describe('UPDATE_SOCIAL_LOGIN_URLS', () => {
        beforeAll(() => {
          payload = {
            google: 'https://www.zopim.com/auth/Google/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY',
            facebook: 'https://www.zopim.com/auth/Facebook/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY'
          };
          action = {
            type: actionTypes.UPDATE_SOCIAL_LOGIN_URLS,
            payload: payload
          };
        });

        it('updates the state with the payload', () => {
          const expected = {
            ...initialState,
            authUrls: payload
          };

          expect(state)
            .toEqual(expected);
        });
      });

      describe('CHAT_SOCIAL_LOGIN_SUCCESS', () => {
        beforeAll(() => {
          payload = 'wwww.terence.com/myAvatar.jpeg';
          action = {
            type: actionTypes.CHAT_SOCIAL_LOGIN_SUCCESS,
            payload: payload
          };
        });

        it('updates the state with the payload', () => {
          const expected = {
            ...initialState,
            authenticated: true,
            avatarPath: payload
          };

          expect(state)
            .toEqual(expected);
        });
      });

      describe('CHAT_SOCIAL_LOGOUT_SUCCESS', () => {
        beforeAll(() => {
          action = { type: actionTypes.CHAT_SOCIAL_LOGOUT_SUCCESS };
        });

        it('updates the state with the payload', () => {
          const expected = {
            ...initialState,
            screen: actionTypes.CHAT_SOCIAL_LOGOUT_SUCCESS,
            avatarPath: '',
            authenticated: false
          };

          expect(state)
            .toEqual(expected);
        });
      });

      describe('CHAT_SOCIAL_LOGOUT_PENDING', () => {
        beforeAll(() => {
          action = { type: actionTypes.CHAT_SOCIAL_LOGOUT_PENDING };
        });

        it('updates the state with the payload', () => {
          const expected = {
            ...initialState,
            screen: actionTypes.CHAT_SOCIAL_LOGOUT_PENDING
          };

          expect(state)
            .toEqual(expected);
        });
      });

      describe('CHAT_SOCIAL_LOGOUT_FAILURE', () => {
        beforeAll(() => {
          action = { type: actionTypes.CHAT_SOCIAL_LOGOUT_FAILURE };
        });

        it('updates the state with the payload', () => {
          const expected = {
            ...initialState,
            screen: actionTypes.CHAT_SOCIAL_LOGOUT_FAILURE
          };

          expect(state)
            .toEqual(expected);
        });
      });
    });
  });
});
