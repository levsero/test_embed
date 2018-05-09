describe('base reducer embeds', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-embeds');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to an empty object', () => {
      expect(initialState)
        .toEqual({});
    });
  });

  describe('when an UPDATE_EMBED action is dispatched', () => {
    let action,
      state,
      newAction,
      newState;

    beforeEach(() => {
      action = {
        type: actionTypes.UPDATE_EMBED,
        payload: {
          name: 'ticketSubmissionForm'
        }
      };

      state = reducer(initialState, action);
    });

    describe('when payload contains accessible', () => {
      beforeEach(() => {
        newAction = {
          type: actionTypes.UPDATE_EMBED,
          payload: {
            name: 'chat',
            params: { accessible: true }
          }
        };

        newState = reducer(state, newAction);
      });

      it('should return new state for the associated embed', () => {
        const expectation = { accessible: true };

        expect(newState.chat)
          .toEqual(expectation);
      });
    });

    describe('when payload does not contain accessible', () => {
      beforeEach(() => {
        newAction = {
          type: actionTypes.UPDATE_EMBED,
          payload: { name: 'helpCenterForm', params: {} }
        };

        newState = reducer(state, newAction);
      });

      it('should return new state with accessible defaulted as false', () => {
        const expectation = { accessible: false };

        expect(newState.helpCenterForm)
          .toEqual(expectation);
      });
    });
  });
});
