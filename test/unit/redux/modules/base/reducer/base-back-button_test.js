describe('base reducer back button', () => {
  let reducer,
    actionTypes,
    getArticleSuccess,
    ticketSubmissionSuccess,
    initialState;

  beforeAll(() => {
    mockery.enable();

    getArticleSuccess = 'getArticleSuccess';
    ticketSubmissionSuccess = 'ticketSubmissionSuccess';

    initMockRegistry({
      'src/redux/modules/helpCenter/helpCenter-action-types': {
        GET_ARTICLE_REQUEST_SUCCESS: getArticleSuccess
      },
      'src/redux/modules/submitTicket/submitTicket-action-types': {
        TICKET_SUBMISSION_REQUEST_SUCCESS: ticketSubmissionSuccess
      }
    });

    const reducerPath = buildSrcPath('redux/modules/base/reducer/back-button-visibility');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
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

  describe('when an UPDATE_BACK_BUTTON_VISIBILITY action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_BACK_BUTTON_VISIBILITY,
        payload: true
      });
    });

    it('sets the action payload as the state', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an GET_ARTICLE_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: getArticleSuccess
      });
    });

    it('sets state to false', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe('when an TICKET_SUBMISSION_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: ticketSubmissionSuccess
      });
    });

    it('sets state to false', () => {
      expect(state)
        .toEqual(false);
    });
  });
});
