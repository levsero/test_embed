describe('helpCenter selectors', () => {
  let getSearchLoading,
    getArticleClicked,
    getSearchFailed,
    getSearchTerm,
    getPreviousSearchTerm,
    getHasSearched,
    getHasContextuallySearched;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/helpCenter/helpCenter-selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getSearchLoading = selectors.getSearchLoading;
    getArticleClicked = selectors.getArticleClicked;
    getSearchFailed = selectors.getSearchFailed;
    getSearchTerm = selectors.getSearchTerm;
    getPreviousSearchTerm = selectors.getPreviousSearchTerm;
    getHasSearched = selectors.getHasSearched;
    getHasContextuallySearched = selectors.getHasContextuallySearched;
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

  describe('getSearchTerm', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        searchTerm: {
          current: 'foo'
        }
      }
    };

    beforeEach(() => {
      result = getSearchTerm(mockHelpCenterState);
    });

    it('returns the current state of searchTerm.current', () => {
      expect(result)
        .toEqual('foo');
    });
  });

  describe('getPreviousSearchTerm', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        searchTerm: {
          previous: 'bar'
        }
      }
    };

    beforeEach(() => {
      result = getPreviousSearchTerm(mockHelpCenterState);
    });

    it('returns the current state of searchTerm.previous', () => {
      expect(result)
        .toEqual('bar');
    });
  });

  describe('getHasSearched', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        hasSearched: true
      }
    };

    beforeEach(() => {
      result = getHasSearched(mockHelpCenterState);
    });

    it('returns the current state of hasSearched', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getHasContextuallySearched', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        hasContextuallySearched: true
      }
    };

    beforeEach(() => {
      result = getHasContextuallySearched(mockHelpCenterState);
    });

    it('returns the current state of hasContextuallySearched', () => {
      expect(result)
        .toEqual(true);
    });
  });
});
