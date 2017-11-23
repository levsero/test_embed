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

    describe('when a TALK_AGENT_AVAILABILITY action is dispatched', () => {
      let agentAvailbility;

      beforeEach(() => {
        agentAvailbility = true;

        state = reducer(initialState, {
          type: actionTypes.TALK_AGENT_AVAILABILITY,
          payload: agentAvailbility
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(agentAvailbility);
      });
    });
  });
});
