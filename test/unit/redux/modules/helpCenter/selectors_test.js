describe('helpCenter selectors', () => {
  let getSearchLoading,
    getArticleClicked,
    getSearchFailed;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/helpCenter/selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getSearchLoading = selectors.getSearchLoading;
    getArticleClicked = selectors.getArticleClicked;
    getSearchFailed = selectors.getSearchFailed;
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

  describe('getArticleClicked', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        articleClicked: true
      }
    };

    beforeEach(() => {
      result = getArticleClicked(mockHelpCenterState);
    });

    it('returns the current state of articleClicked', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getSearchFailed', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        searchFailed: true
      }
    };

    beforeEach(() => {
      result = getSearchFailed(mockHelpCenterState);
    });

    it('returns the current state of searchFailed', () => {
      expect(result)
        .toEqual(true);
    });
  });
});
