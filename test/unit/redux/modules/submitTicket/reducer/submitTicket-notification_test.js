describe('submitTicket reducer notification', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/submitTicket/reducer/submitTicket-notification');
    const actionTypesPath = buildSrcPath('redux/modules/submitTicket/submitTicket-action-types');
    const baseActionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
    baseActionTypes = requireUncached(baseActionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to an object with show false', () => {
      const expected = {
        show: false
      };

      expect(initialState)
        .toEqual(jasmine.objectContaining(expected));
    });
  });

  describe('when an TICKET_SUBMISSION_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.TICKET_SUBMISSION_REQUEST_SUCCESS
      });
    });

    it('sets the show state to true', () => {
      expect(state.show)
        .toEqual(true);
    });
  });

  describe('when an WIDGET_HIDE_ANIMATION_COMPLETE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer({ show: true }, {
        type: baseActionTypes.WIDGET_HIDE_ANIMATION_COMPLETE
      });
    });

    it('sets the show state to false', () => {
      expect(state.show)
        .toEqual(false);
    });
  });
});
