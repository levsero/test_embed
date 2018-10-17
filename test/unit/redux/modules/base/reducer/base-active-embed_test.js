describe('base reducer activeEmbed', () => {
  let reducer,
    actionTypes,
    getArticleSuccess,
    zopimShow,
    initialState;

  beforeAll(() => {
    mockery.enable();

    getArticleSuccess = 'getArticleSuccess';
    zopimShow = 'zopimChat';

    initMockRegistry({
      'src/redux/modules/helpCenter/helpCenter-action-types': {
        GET_ARTICLE_REQUEST_SUCCESS: getArticleSuccess
      },
      'src/redux/modules/zopimChat/zopimChat-action-types': {
        ZOPIM_SHOW: zopimShow
      }
    });

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-active-embed');
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
    it('is set to a empty string', () => {
      expect(initialState)
        .toEqual('');
    });
  });

  describe('when an UPDATE_ACTIVE_EMBED action is dispatched', () => {
    let activeEmbed,
      state;

    beforeEach(() => {
      activeEmbed = 'helpCenter';

      state = reducer(initialState, {
        type: actionTypes.UPDATE_ACTIVE_EMBED,
        payload: activeEmbed
      });
    });

    it('sets the action payload as the state', () => {
      expect(state)
        .toEqual(activeEmbed);
    });
  });

  describe('when an GET_ARTICLE_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: getArticleSuccess
      });
    });

    it('sets the helpCenterForm as the state', () => {
      expect(state)
        .toEqual('helpCenterForm');
    });
  });

  describe('when an ZOPIM_SHOW action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: zopimShow
      });
    });

    it('sets the zopimChat as the state', () => {
      expect(state)
        .toEqual('zopimChat');
    });
  });
});
