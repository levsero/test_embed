describe('submitTicket reducer loading', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/submitTicket/reducer/submitTicket-loading');
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
    it('is set to false', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe('when an TICKET_FIELDS_REQUEST_SENT action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_FIELDS_REQUEST_SENT
      });
    });

    it('sets the state to the true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an TICKET_FORMS_REQUEST_SENT action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_FORMS_REQUEST_SENT
      });
    });

    it('sets the state to the true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an TICKET_FIELDS_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_FIELDS_REQUEST_SUCCESS
      });
    });

    it('sets the state to the false', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe('when an TICKET_FORMS_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_FORMS_REQUEST_SUCCESS
      });
    });

    it('sets the state to the false', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe('when an TICKET_FIELDS_REQUEST_FAILURE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_FIELDS_REQUEST_FAILURE
      });
    });

    it('sets the state to the false', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe('when an TICKET_FORMS_REQUEST_FAILURE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_FORMS_REQUEST_FAILURE
      });
    });

    it('sets the state to the false', () => {
      expect(state)
        .toEqual(false);
    });
  });
});
