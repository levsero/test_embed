describe('banner', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/account-settings/banner');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('when GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
        payload: {
          banner: {
            layout: 'image_left',
            image_path: 'http://img.com/img.png',
            text: 'chat it up'
          }
        }
      });
    });

    it('returns the banner state', () => {
      expect(state)
        .toEqual({
          layout: 'image_left',
          image: 'http://img.com/img.png',
          text: 'chat it up'
        });
    });
  });
});
