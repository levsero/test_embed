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
      it('agentAvailbility is set to an object with default properties', () => {
        expect(initialState)
          .toBe(false);
      });
    });

    describe('when a UPDATE_TALK_AGENT_AVAILABILITY action is dispatched', () => {
      let agentAvailability;

      beforeEach(() => {
        agentAvailability = 'true';

        state = reducer(initialState, {
          type: actionTypes.UPDATE_TALK_AGENT_AVAILABILITY,
          payload: agentAvailability
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toBe(true);
      });
    });

    describe('when the payload is undefined', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_TALK_AGENT_AVAILABILITY,
          payload: undefined
        });
      });

      it('does not update state', () => {
        expect(state)
          .toEqual(initialState);
      });
    });
  });
});
