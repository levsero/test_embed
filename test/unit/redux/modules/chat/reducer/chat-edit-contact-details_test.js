describe('chat reducer editContactDetails', () => {
  let reducer,
    actionTypes,
    initialState,
    baseActionTypes,
    EDIT_CONTACT_DETAILS_SCREEN,
    EDIT_CONTACT_DETAILS_LOADING_SCREEN,
    EDIT_CONTACT_DETAILS_ERROR_SCREEN;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-edit-contact-details');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');
    const chatConstantsPath = basePath('src/constants/chat');
    const baseActionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    EDIT_CONTACT_DETAILS_SCREEN = requireUncached(chatConstantsPath).EDIT_CONTACT_DETAILS_SCREEN;
    EDIT_CONTACT_DETAILS_LOADING_SCREEN = requireUncached(chatConstantsPath).EDIT_CONTACT_DETAILS_LOADING_SCREEN;
    EDIT_CONTACT_DETAILS_ERROR_SCREEN = requireUncached(chatConstantsPath).EDIT_CONTACT_DETAILS_ERROR_SCREEN;

    initMockRegistry({
      'constants/chat': {
        EDIT_CONTACT_DETAILS_SCREEN,
        EDIT_CONTACT_DETAILS_LOADING_SCREEN,
        EDIT_CONTACT_DETAILS_ERROR_SCREEN
      }
    });

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
    baseActionTypes = requireUncached(baseActionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('is set to an object with initial values', () => {
        const expected = {
          status: EDIT_CONTACT_DETAILS_SCREEN,
          show: false,
          display_name: null,
          email: null,
          error: false
        };

        expect(initialState)
          .toEqual(expected);
      });
    });

    describe('when a SET_VISITOR_INFO_REQUEST_SUCCESS action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.SET_VISITOR_INFO_REQUEST_SUCCESS,
          payload: { display_name: 'Bob', email: 'bob@bob.com' }
        });
      });

      it('sets state.status to EDIT_CONTACT_DETAILS_SCREEN', () => {
        expect(state.status)
          .toEqual(EDIT_CONTACT_DETAILS_SCREEN);
      });

      it('updates the display_name and email state', () => {
        expect(state.display_name)
          .toEqual('Bob');

        expect(state.email)
          .toEqual('bob@bob.com');
      });

      it('sets state.show to false', () => {
        expect(state.show)
          .toEqual(false);
      });
    });

    describe('when a SET_VISITOR_INFO_REQUEST_PENDING action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.SET_VISITOR_INFO_REQUEST_PENDING,
          payload: { display_name: 'Bob', email: 'bob@bob.com' }
        });
      });

      it('sets state.status to EDIT_CONTACT_DETAILS_LOADING_SCREEN', () => {
        expect(state.status)
          .toEqual(EDIT_CONTACT_DETAILS_LOADING_SCREEN);
      });

      it('updates the display_name and email state', () => {
        expect(state.display_name)
          .toEqual('Bob');

        expect(state.email)
          .toEqual('bob@bob.com');
      });

      it('sets state.show to remain unchanged', () => {
        expect(state.show)
          .toEqual(false);
      });
    });

    describe('when a SDK_ERROR action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, { type: actionTypes.SDK_ERROR });
      });

      it('sets state.status to EDIT_CONTACT_DETAILS_ERROR_SCREEN', () => {
        expect(state.status)
          .toEqual(EDIT_CONTACT_DETAILS_ERROR_SCREEN);
      });

      it('sets state.show to true', () => {
        expect(state.show)
          .toEqual(false);
      });
    });

    describe('when a UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = true;
        state = reducer(initialState, {
          type: actionTypes.UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
          payload: payload
        });
      });

      it('sets state.status to EDIT_CONTACT_DETAILS_SCREEN', () => {
        expect(state.status)
          .toEqual(EDIT_CONTACT_DETAILS_SCREEN);
      });

      it('sets state.show with payload data', () => {
        expect(state.show)
          .toEqual(payload);
      });
    });

    describe('when a API_CLEAR_FORM action is dispatched', () => {
      let payload = {
          display_name: 'Why did this pass?',
          email: 'this@shouldntEx.ist'
        },
        mockState = {
          status: EDIT_CONTACT_DETAILS_SCREEN,
          show: true,
          display_name: 'Bobby',
          email: 'Hey@LookAnEm.ail',
          error: false
        };

      beforeEach(() => {
        state = reducer(mockState, {
          type: baseActionTypes.API_CLEAR_FORM,
          payload: payload
        });
      });

      it('sets the state to its initial values', () => {
        expect(state)
          .toEqual(initialState);
      });
    });

    describe('when an unmatched action is dispatched', () => {
      let mockInitialState;

      beforeEach(() => {
        mockInitialState = {
          status: EDIT_CONTACT_DETAILS_ERROR_SCREEN,
          show: true
        };
        state = reducer(mockInitialState, { type: 'foo' });
      });

      it('returns the current state', () => {
        expect(state)
          .toEqual(mockInitialState);
      });
    });
  });
});
