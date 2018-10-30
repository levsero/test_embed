describe('helpCenter reducer rest', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-restrictedImages');
    const actionTypesPath = buildSrcPath('redux/modules/helpCenter/helpCenter-action-types');
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
    it('is is an empty object', () => {
      expect(initialState)
        .toEqual({});
    });
  });

  describe('when an ADD_RESTRICTED_IMAGE action is dispatched', () => {
    let state;
    const initialStateObj = {};

    beforeEach(() => {
      state = reducer(initialStateObj, {
        type: actionTypes.ADD_RESTRICTED_IMAGE,
        payload: {
          'http://img.lnk': 'blob:http://img.lnk'
        }
      });
    });

    it('adds the restricted image', () => {
      expect(state)
        .toEqual({
          'http://img.lnk': 'blob:http://img.lnk'
        });
    });
  });

  describe('when multiple ADD_RESTRICTED_IMAGE actions are dispatched', () => {
    let state;
    const initialStateObj = {};

    beforeEach(() => {
      state = reducer(initialStateObj, {
        type: actionTypes.ADD_RESTRICTED_IMAGE,
        payload: {
          'http://img1.lnk': 'blob:http://img1.lnk'
        }
      });
      state = reducer(state, {
        type: actionTypes.ADD_RESTRICTED_IMAGE,
        payload: {
          'http://img2.lnk': 'blob:http://img2.lnk'
        }
      });
    });

    it('adds both restricted images', () => {
      expect(state)
        .toEqual({
          'http://img1.lnk': 'blob:http://img1.lnk',
          'http://img2.lnk': 'blob:http://img2.lnk'
        });
    });
  });

  describe('when an irrelevant action is dispatched', () => {
    let state,
      initialStateObj;

    beforeEach(() => {
      initialStateObj = {};
      state = reducer(initialStateObj, {
        type: '',
        payload: 'baz'
      });
    });

    it('does not affect state', () => {
      expect(state)
        .toEqual({});
    });
  });

  describe('when an API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state,
      mockState;

    beforeEach(() => {
      mockState = 'Bye Felicia';

      state = reducer(mockState, {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES,
        payload: {
          'http://img.lnk': 'blob:http://img.lnk'
        }
      });
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual({});
    });
  });
});
