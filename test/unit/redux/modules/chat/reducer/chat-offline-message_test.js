describe('chat reducer offline message', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-offline-message');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    initMockRegistry({
      'constants/chat': {
        OFFLINE_FORM_SCREENS: {
          MAIN: 'main',
          SUCCESS: 'success',
          LOADING: 'loading'
        }
      }
    });

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
    const mockInitialState = {
      screen: 'main',
      message: {},
      error: false
    };

    describe('initial state', () => {
      it('is set to an expected object', () => {
        expect(initialState)
          .toEqual(mockInitialState);
      });
    });

    describe('when a OFFLINE_FORM_REQUEST_SENT action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.OFFLINE_FORM_REQUEST_SENT };

        state = reducer(initialState, action);
      });

      it('updates the state', () => {
        const expected = {
          message: {},
          error: false,
          screen: 'loading'
        };

        expect(state)
          .toEqual(expected);
      });
    });

    describe('when a OFFLINE_FORM_REQUEST_SUCCESS action is dispatched', () => {
      const payload  = {
        name: 'Boromir',
        email: 'boromir@gondor.nw',
        message: 'One does not simply walk into Mordor'
      };

      beforeEach(() => {
        const action = { type: actionTypes.OFFLINE_FORM_REQUEST_SUCCESS, payload };

        state = reducer(initialState, action);
      });

      it('updates the state with payload and screen', () => {
        const expected = _.merge({}, mockInitialState, { message: payload, screen: 'success' });

        expect(state)
          .toEqual(expected);
      });
    });

    describe('when a OFFLINE_FORM_REQUEST_FAILURE action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.OFFLINE_FORM_REQUEST_FAILURE };

        state = reducer(initialState, action);
      });

      it('updates the state with error true', () => {
        const expected = _.merge({}, mockInitialState, { error: true });

        expect(state)
          .toEqual(expected);
      });
    });

    describe('when a OFFLINE_FORM_BACK_CLICKED action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.OFFLINE_FORM_BACK_CLICKED };

        state = reducer(initialState, action);
      });

      it('updates the state with screen main', () => {
        const expected = _.merge({}, mockInitialState, { screen: 'main' });

        expect(state)
          .toEqual(expected);
      });
    });
  });
});
