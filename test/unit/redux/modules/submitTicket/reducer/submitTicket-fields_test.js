describe('submitTicket reducer fields', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/submitTicket/reducer/submitTicket-fields');
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

  describe('when an TICKET_FIELDS_REQUEST_SUCCESS action is dispatched', () => {
    let state;
    const mockTicketFields=[{ id: 123 }];

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_FIELDS_REQUEST_SUCCESS,
        payload: mockTicketFields
      });
    });

    it('sets the state to the payload', () => {
      expect(state)
        .toEqual(mockTicketFields);
    });
  });

  describe('when an TICKET_FORMS_REQUEST_SUCCESS action is dispatched', () => {
    let state;
    const mockTicketForms = {
      ticket_fields: [{ id: 234 }] // eslint-disable-line camelcase
    };

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_FORMS_REQUEST_SUCCESS,
        payload: mockTicketForms
      });
    });

    it('sets the state as the ticket_fields key of the payload', () => {
      expect(state)
        .toEqual(mockTicketForms.ticket_fields);
    });
  });
});
