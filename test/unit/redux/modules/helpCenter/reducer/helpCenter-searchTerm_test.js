describe('helpCenter reducer searchTerm', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-searchTerm');
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
    it('is is an object with previous and current set to empty strings', () => {
      expect(initialState)
        .toEqual({
          previous: '',
          current: ''
        });
    });
  });

  describe('when an SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state;
    const initialStateObj = {
      current: 'foobar',
      previous: ''
    };

    beforeEach(() => {
      state = reducer(initialStateObj, {
        type: actionTypes.SEARCH_REQUEST_SUCCESS
      });
    });

    it('sets the previous state to the current state', () => {
      expect(state.previous)
        .toEqual(initialStateObj.current);
    });

    it('does not change the current state', () => {
      expect(state.current)
        .toEqual(initialStateObj.current);
    });
  });

  describe('when an CONTEXTUAL_SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state;
    const initialStateObj = {
      current: 'foobar',
      previous: ''
    };

    beforeEach(() => {
      state = reducer(initialStateObj, {
        type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS
      });
    });

    it('sets the previous state to the current state', () => {
      expect(state.previous)
        .toEqual(initialStateObj.current);
    });

    it('does not change the current state', () => {
      expect(state.current)
        .toEqual(initialStateObj.current);
    });
  });

  describe('when an SEARCH_REQUEST_FAILURE action is dispatched', () => {
    let state;
    const initialStateObj = {
      current: 'foobar',
      previous: ''
    };

    beforeEach(() => {
      state = reducer(initialStateObj, {
        type: actionTypes.SEARCH_REQUEST_FAILURE
      });
    });

    it('sets the previous state to the current state', () => {
      expect(state.previous)
        .toEqual(initialStateObj.current);
    });

    it('does not change the current state', () => {
      expect(state.current)
        .toEqual(initialStateObj.current);
    });
  });

  describe('when an CONTEXTUAL_SEARCH_REQUEST_FAILURE action is dispatched', () => {
    let state;
    const initialStateObj = {
      current: 'foobar',
      previous: ''
    };

    beforeEach(() => {
      state = reducer(initialStateObj, {
        type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE
      });
    });

    it('sets the previous state to the current state', () => {
      expect(state.previous)
        .toEqual(initialStateObj.current);
    });

    it('does not change the current state', () => {
      expect(state.current)
        .toEqual(initialStateObj.current);
    });
  });

  describe('when an SEARCH_REQUEST_SENT action is dispatched', () => {
    let state;
    const initialStateObj = {
      current: 'foobar',
      previous: 'foobar'
    };

    beforeEach(() => {
      state = reducer(initialStateObj, {
        type: actionTypes.SEARCH_REQUEST_SENT,
        payload: {
          searchTerm: 'baz'
        }
      });
    });

    it('sets the current state to the payload passed in', () => {
      expect(state.current)
        .toEqual('baz');
    });

    it('does not change the previous state', () => {
      expect(state.previous)
        .toEqual(initialStateObj.previous);
    });
  });

  describe('when an CONTEXTUAL_SEARCH_REQUEST_SENT action is dispatched', () => {
    let state;
    const initialStateObj = {
      current: 'foobar',
      previous: 'foobar'
    };

    beforeEach(() => {
      state = reducer(initialStateObj, {
        type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT,
        payload: {
          searchTerm: 'baz'
        }
      });
    });

    it('sets the current state to the payload passed in', () => {
      expect(state.current)
        .toEqual('baz');
    });

    it('does not change the previous state', () => {
      expect(state.previous)
        .toEqual(initialStateObj.previous);
    });
  });

  describe('when an API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state;
    const
      initialStateObj = {
        current: 'foobar',
        previous: 'foobar'
      },
      expected = {
        current: '',
        previous: ''
      };

    beforeEach(() => {
      state = reducer(initialStateObj, {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES,
        payload: {
          searchTerm: 'baz'
        }
      });
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual(expected);
    });
  });
});
