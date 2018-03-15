describe('submitTicket reducer errorMsg', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/submitTicket/reducer/submitTicket-errorMsg');
    const actionTypesPath = buildSrcPath('redux/modules/submitTicket/submitTicket-action-types');

    reducer = requireUncached(reducerPath).default;
    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to an empty string', () => {
      expect(initialState)
        .toEqual('');
    });
  });

  describe('when an TICKET_SUBMISSION_REQUEST_FAILURE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_SUBMISSION_REQUEST_FAILURE,
        payload: 'Ya messed up'
      });
    });

    it('sets the state to the payload', () => {
      expect(state)
        .toEqual('Ya messed up');
    });
  });

  describe('when an TICKET_SUBMISSION_REQUEST_SENT action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer('Ya messed up', {
        type: actionTypes.TICKET_SUBMISSION_REQUEST_SENT
      });
    });

    it('sets the state to an empty string', () => {
      expect(state)
        .toEqual('');
    });
  });
});
