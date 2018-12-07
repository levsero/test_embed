describe('base reducer hidden', () => {
  let actionTypes,
    reducer,
    expectedState,
    initialState,
    state;

  beforeAll(() => {
    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-hidden');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  beforeEach(() => {
    expectedState = {
      hideApi: false,
      activateApi: false
    };
  });

  describe('initial state', () => {
    it('is set to defaults', () => {
      expect(initialState)
        .toEqual(expectedState);
    });
  });

  describe('when ACTIVATE_RECEIVED is passed', () => {
    beforeEach(() => {
      expectedState = {
        hideApi: false,
        activateApi: true
      };
      state = reducer(undefined, { type: actionTypes.ACTIVATE_RECEIVED,
        payload: {
          hideOnClose: true
        }
      });
    });

    describe('hideOnClose is true', () => {
      it('activateApi is true, hideApi is false', () => {
        expect(state)
          .toEqual(expectedState);
      });
    });

    describe('hideOnClose is false', () => {
      beforeEach(() => {
        expectedState = {
          hideApi: false,
          activateApi: false
        };

        state = reducer(undefined, { type: actionTypes.ACTIVATE_RECEIVED,
          payload: {
            hideOnClose: false
          }
        });
      });

      it('both values are false', () => {
        expect(state)
          .toEqual(expectedState);
      });
    });
  });

  describe('when HIDE_RECEIVED is passed', () => {
    beforeEach(() => {
      expectedState = {
        hideApi: true,
        activateApi: true
      };

      state = reducer(undefined, {
        type: actionTypes.HIDE_RECEIVED,
        payload: {}
      });
    });

    it('hideApi is true, activateApi is false', () => {
      expect(state)
        .toEqual(expectedState);
    });
  });

  describe('when LEGACY_SHOW_RECEIVED is passed', () => {
    beforeEach(() => {
      state = reducer(undefined, {
        type: actionTypes.LEGACY_SHOW_RECEIVED,
        payload: {}
      });
    });

    it('both values are false', () => {
      expect(state)
        .toEqual(expectedState);
    });
  });

  describe('when SHOW_RECEIVED is passed', () => {
    beforeEach(() => {
      state = reducer(undefined, {
        type: actionTypes.SHOW_RECEIVED,
        payload: {}
      });
    });

    it('both values are false', () => {
      expect(state)
        .toEqual(expectedState);
    });
  });
});
