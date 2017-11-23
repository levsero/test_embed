describe('helpCenter selectors', () => {
  let getSearchLoading;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/helpCenter/selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getSearchLoading = selectors.getSearchLoading;
  });

  describe('getSearchLoading', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        searchLoading: true
      }
    };

    beforeEach(() => {
      result = getSearchLoading(mockHelpCenterState);
    });

    it('returns the current state of searchLoading', () => {
      expect(result)
        .toEqual(true);
    });
  });
});
