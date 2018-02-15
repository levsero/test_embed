describe('chat email transcript', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-email-transcript');
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
      it('is set to empty email and idle status ', () => {
        expect(initialState)
          .toEqual({
            status: actionTypes.EMAIL_TRANSCRIPT_IDLE,
            email: ''
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

      it('updates email to the specified email', () => {
        expect(state.email)
          .toEqual('john@john.com');
      });

      it('updates status to EMAIL_TRANSCRIPT_REQUEST_SENT', () => {
        expect(state.status)
          .toEqual(actionTypes.EMAIL_TRANSCRIPT_REQUEST_SENT);
      });
    });

    describe('when a EMAIL_TRANSCRIPT_SUCCESS action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.EMAIL_TRANSCRIPT_SUCCESS,
          payload: 'john@john.com'
        });
      });

      it('updates email to the specified email', () => {
        expect(state.email)
          .toEqual('john@john.com');
      });

      it('updates status to EMAIL_TRANSCRIPT_SUCCESS', () => {
        expect(state.status)
          .toEqual(actionTypes.EMAIL_TRANSCRIPT_SUCCESS);
      });
    });

    describe('when a EMAIL_TRANSCRIPT_FAILURE action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.EMAIL_TRANSCRIPT_FAILURE,
          payload: 'john@john.com'
        });
      });

      it('updates email to the specified email', () => {
        expect(state.email)
          .toEqual('john@john.com');
      });

      it('updates status to EMAIL_TRANSCRIPT_FAILURE', () => {
        expect(state.status)
          .toEqual(actionTypes.EMAIL_TRANSCRIPT_FAILURE);
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

      it('updates status to EMAIL_TRANSCRIPT_IDLE', () => {
        expect(state.status)
          .toEqual(actionTypes.EMAIL_TRANSCRIPT_IDLE);
      });
    });

    describe('when an irrelevant action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: 'yolo',
          payload: 'john@john.com'
        });
      });

      it('does not update eail', () => {
        expect(state.email)
          .toEqual('');
      });

      it('updates status to EMAIL_TRANSCRIPT_IDLE', () => {
        expect(state.status)
          .toEqual(actionTypes.EMAIL_TRANSCRIPT_IDLE);
      });
    });
  });
});
