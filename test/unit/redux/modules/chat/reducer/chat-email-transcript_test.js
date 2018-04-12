describe('chat email transcript', () => {
  let reducer,
    actionTypes,
    screenTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-email-transcript');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');
    const screenTypesPath = buildSrcPath('redux/modules/chat/chat-screen-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);
    screenTypes = requireUncached(screenTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('is set to empty email and idle screen ', () => {
        expect(initialState)
          .toEqual({
            screen: screenTypes.EMAIL_TRANSCRIPT_SCREEN,
            show: false,
            email: '',
            error: false
          });
      });
    });

    describe('when a EMAIL_TRANSCRIPT_REQUEST_SENT action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.EMAIL_TRANSCRIPT_REQUEST_SENT,
          payload: 'john@john.com'
        });
      });

      it('resets the error state', () => {
        expect(state.error)
          .toBe(false);
      });

      it('updates email to the specified email', () => {
        expect(state.email)
          .toEqual('john@john.com');
      });

      it('updates screen to EMAIL_TRANSCRIPT_LOADING_SCREEN', () => {
        expect(state.screen)
          .toEqual(screenTypes.EMAIL_TRANSCRIPT_LOADING_SCREEN);
      });
    });

    describe('when a EMAIL_TRANSCRIPT_SUCCESS action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.EMAIL_TRANSCRIPT_SUCCESS,
          payload: 'john@john.com'
        });
      });

      it('resets the error state', () => {
        expect(state.error)
          .toBe(false);
      });

      it('updates email to the specified email', () => {
        expect(state.email)
          .toEqual('john@john.com');
      });

      it('updates screen to EMAIL_TRANSCRIPT_SUCCESS_SCREEN', () => {
        expect(state.screen)
          .toEqual(screenTypes.EMAIL_TRANSCRIPT_SUCCESS_SCREEN);
      });
    });

    describe('when a EMAIL_TRANSCRIPT_IDLE action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.EMAIL_TRANSCRIPT_IDLE,
          payload: 'john@john.com'
        });
      });

      it('updates email to the specified email', () => {
        expect(state.email)
          .toEqual('john@john.com');
      });

      it('updates screen to EMAIL_TRANSCRIPT_SCREEN', () => {
        expect(state.screen)
          .toEqual(screenTypes.EMAIL_TRANSCRIPT_SCREEN);
      });
    });

    describe('when a RESET_EMAIL_TRANSCRIPT action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.RESET_EMAIL_TRANSCRIPT
        });
      });

      it('sets email to nothing', () => {
        expect(state.email)
          .toEqual('');
      });

      it('updates screen to EMAIL_TRANSCRIPT_SCREEN', () => {
        expect(state.screen)
          .toEqual(screenTypes.EMAIL_TRANSCRIPT_SCREEN);
      });
    });

    describe('when a SDK_ERROR action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.SDK_ERROR
        });
      });

      it('sets the error state to true', () => {
        expect(state.error)
          .toBe(true);
      });

      it('updates screen to EMAIL_TRANSCRIPT_FAILURE_SCREEN', () => {
        expect(state.screen)
          .toEqual(screenTypes.EMAIL_TRANSCRIPT_FAILURE_SCREEN);
      });
    });

    describe('when an UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY,
          payload: true
        });
      });

      it('updates show with the value from the payload', () => {
        expect(state.show)
          .toBe(true);
      });

      it('updates screen to EMAIL_TRANSCRIPT_SCREEN', () => {
        expect(state.screen)
          .toEqual(screenTypes.EMAIL_TRANSCRIPT_SCREEN);
      });
    });

    describe('when an irrelevant action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: 'yolo',
          payload: 'john@john.com'
        });
      });

      it('does not update email', () => {
        expect(state.email)
          .toEqual('');
      });

      it('updates screen to EMAIL_TRANSCRIPT_SCREEN', () => {
        expect(state.screen)
          .toEqual(screenTypes.EMAIL_TRANSCRIPT_SCREEN);
      });
    });
  });
});
