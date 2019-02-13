describe('talk reducer agent-availability', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-agent-availability');
    const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');

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
      it('agentAvailability is set to an object with default properties', () => {
        expect(initialState)
          .toBe(false);
      });
    });

    describe('when a TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT action is received', () => {
      let agentAvailability;

      beforeEach(() => {
        agentAvailability = true;

        state = reducer(initialState, {
          type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
          payload: { agentAvailability }
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toBe(true);
      });
    });

    describe('when a TALK_AGENT_AVAILABILITY_SOCKET_EVENT action is received', () => {
      let agentAvailability;

      beforeEach(() => {
        agentAvailability = true;

        state = reducer(initialState, {
          type: actionTypes.TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
          payload: { agentAvailability }
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toBe(true);
      });
    });

    describe('when a TALK_DISCONNECT_SOCKET_EVENT action is received', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.TALK_DISCONNECT_SOCKET_EVENT
        });
      });

      it('sets the state to false', () => {
        expect(state)
          .toBe(false);
      });
    });

    describe('when the payload is undefined', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
          payload: { agentAvailability: undefined }
        });
      });

      it('does not update state', () => {
        expect(state)
          .toEqual(false);
      });
    });
  });
});
