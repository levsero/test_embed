describe('submitTicket reducer forms', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/submitTicket/reducer/submitTicket-forms');
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
    it('is set to an empty array', () => {
      expect(initialState)
        .toEqual([]);
    });
  });

  describe('when an TICKET_FORMS_REQUEST_SUCCESS action is dispatched', () => {
    let state;
    const mockTicketForms = {
      ticket_forms: [{ id: 567 }] // eslint-disable-line camelcase
    };

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_FORMS_REQUEST_SUCCESS,
        payload: mockTicketForms
      });
    });

    it('sets the state as the ticket_forms key of the payload', () => {
      expect(state)
        .toEqual(mockTicketForms.ticket_forms);
    });
  });
});
