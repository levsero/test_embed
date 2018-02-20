describe('submitTicket reducer activeForm', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/submitTicket/reducer/submitTicket-activeForm');
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
    it('is set to null', () => {
      expect(initialState)
        .toEqual(null);
    });
  });

  describe('when an TICKET_FORM_UPDATE action is dispatched', () => {
    let state;
    const mockForm = { id: '123abc' };

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_FORM_UPDATE,
        payload: mockForm
      });
    });

    it('sets the state to the payload', () => {
      expect(state)
        .toEqual(mockForm);
    });
  });
});
