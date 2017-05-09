describe('base reducer embeds', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-embeds');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

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

  describe('when an UPDATE_EMBED action is dispatched', () => {
    let payload,
      state,
      newState;

    beforeEach(() => {
      payload = {
        detail: {
          name: 'submitTicket',
          accessible: true
        }
      };

      state = reducer(initialState, {
        type: actionTypes.UPDATE_EMBED,
        payload: payload
      });
    });

    describe('when the embed is not present', () => {
      beforeEach(() => {
        newState = reducer(state, {
          type: actionTypes.UPDATE_EMBED,
          payload: {
            detail: _.extend({}, payload.detail, { name: 'helpCenter' })
          }
        });
      });

      it('adds an embed with the payload data', () => {
        expect(newState[payload.detail.name])
          .toEqual(payload.detail);
      });
    });

    describe('when the embed is present', () => {
      beforeEach(() => {
        newState = reducer(state, {
          type: actionTypes.UPDATE_EMBED,
          payload: {
            detail: _.extend({}, payload.detail, { accessible: false })
          }
        });
      });

      it('updates the embed with the payload data', () => {
        expect(newState[payload.detail.name].accessible)
          .toEqual(false);
      });
    });
  });
});
