describe('helpCenter selectors', () => {
  let getSearchLoading,
    getArticleClicked,
    getViewMoreClicked,
    getSearchFailed,
    getSearchTerm,
    getPreviousSearchTerm,
    getHasSearched,
    getHasContextuallySearched,
    getActiveArticle,
    getResultsCount,
    getShowViewMore,
    getResultsPerPage,
    getArticles,
    getArticleViewActive,
    getTotalUserSearches;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/helpCenter/helpCenter-selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getSearchLoading = selectors.getSearchLoading;
    getArticleClicked = selectors.getArticleClicked;
    getViewMoreClicked = selectors.getViewMoreClicked;
    getSearchFailed = selectors.getSearchFailed;
    getSearchTerm = selectors.getSearchTerm;
    getPreviousSearchTerm = selectors.getPreviousSearchTerm;
    getHasSearched = selectors.getHasSearched;
    getHasContextuallySearched = selectors.getHasContextuallySearched;
    getActiveArticle = selectors.getActiveArticle;
    getResultsCount = selectors.getResultsCount;
    getShowViewMore = selectors.getShowViewMore;
    getResultsPerPage = selectors.getResultsPerPage;
    getArticles = selectors.getArticles;
    getArticleViewActive = selectors.getArticleViewActive;
    getTotalUserSearches = selectors.getTotalUserSearches;
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

  describe('getViewMoreClicked', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        viewMoreClicked: true
      }
    };

    beforeEach(() => {
      result = getViewMoreClicked(mockHelpCenterState);
    });

    it('returns the current state of viewMoreClicked', () => {
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
    let result,
      mockHelpCenterState;

    beforeEach(() => {
      mockHelpCenterState = {
        helpCenter: {
          hasContextuallySearched: false,
          totalUserSearches: 0
        }
      };
    });

    describe('when hasContextuallySearched is true', () => {
      beforeEach(() => {
        mockHelpCenterState.helpCenter.hasContextuallySearched = true;
      });

      describe('when totalUserSearches is greater than 0', () => {
        beforeEach(() => {
          mockHelpCenterState.helpCenter.totalUserSearches = 10;
          result = getHasSearched(mockHelpCenterState);
        });

        it('state of hasSearched should be true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when totalUserSearches is 0', () => {
        beforeEach(() => {
          mockHelpCenterState.helpCenter.totalUserSearches = 0;
          result = getHasSearched(mockHelpCenterState);
        });

        it('state of hasSearched should be true', () => {
          expect(result)
            .toEqual(true);
        });
      });
    });

    describe('when hasContextuallySearched is false', () => {
      beforeEach(() => {
        mockHelpCenterState.helpCenter.hasContextuallySearched = false;
      });

      describe('when totalUserSearches is greater than 0', () => {
        beforeEach(() => {
          mockHelpCenterState.helpCenter.totalUserSearches = 10;
          result = getHasSearched(mockHelpCenterState);
        });

        it('state of hasSearched should be true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when totalUserSearches is 0', () => {
        beforeEach(() => {
          mockHelpCenterState.helpCenter.totalUserSearches = 0;
          result = getHasSearched(mockHelpCenterState);
        });

        it('state of hasSearched should be false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });
  });

  describe('getTotalUserSearches', () => {
    let result,
      mockHelpCenterState;

    beforeEach(() => {
      mockHelpCenterState = {
        helpCenter: {
          totalUserSearches: 0
        }
      };
    });

    describe('when no searches have been made', () => {
      beforeEach(() => {
        result = getTotalUserSearches(mockHelpCenterState);
      });

      it('returns 0', () => {
        expect(result)
          .toEqual(0);
      });
    });

    describe('when 1 search has been made', () => {
      beforeEach(() => {
        mockHelpCenterState.helpCenter.totalUserSearches = 1;
        result = getTotalUserSearches(mockHelpCenterState);
      });

      it('returns 1', () => {
        expect(result)
          .toEqual(1);
      });
    });

    describe('when multiple searches have been made', () => {
      beforeEach(() => {
        mockHelpCenterState.helpCenter.totalUserSearches = 10;
        result = getTotalUserSearches(mockHelpCenterState);
      });

      it('returns 10', () => {
        expect(result)
          .toEqual(10);
      });
    });
  });

  describe('getHasContextuallySearched', () => {
    let result,
      mockHelpCenterState;

    beforeEach(() => {
      mockHelpCenterState = {
        helpCenter: {
          hasContextuallySearched: true
        }
      };
    });

    describe('when contextual search made', () => {
      beforeEach(() => {
        result = getHasContextuallySearched(mockHelpCenterState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when contextual search not made', () => {
      beforeEach(() => {
        mockHelpCenterState.helpCenter.hasContextuallySearched = false;
        result = getHasContextuallySearched(mockHelpCenterState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getActiveArticle', () => {
    let result;
    const mockArticle = { id: 1337, body: '<p>money money money</p>' };
    const mockHelpCenterState = {
      helpCenter: {
        activeArticle: mockArticle
      }
    };

    beforeEach(() => {
      result = getActiveArticle(mockHelpCenterState);
    });

    it('returns the current state of activeArticle', () => {
      expect(result)
        .toEqual(mockArticle);
    });
  });

  describe('getResultsCount', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        resultsCount: 5
      }
    };

    beforeEach(() => {
      result = getResultsCount(mockHelpCenterState);
    });

    it('returns the current state of resultsCount', () => {
      expect(result)
        .toEqual(5);
    });
  });

  describe('showViewMore', () => {
    let result;

    describe('when resultsCount is higher than # of articles and contextual search and view more click are false', () => {
      const mockHelpCenterState = {
        helpCenter: {
          viewMoreClicked: false,
          hasContextuallySearched: false,
          resultsCount: 4,
          articles: [{ id: 1 }, { id: 2 }, { id: 3 }]
        }
      };

      beforeEach(() => {
        result = getShowViewMore(mockHelpCenterState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });
  });

  describe('resultsPerPage', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        resultsPerPage: 3
      }
    };

    beforeEach(() => {
      result = getResultsPerPage(mockHelpCenterState);
    });

    it('returns the current state of resultsPerPage', () => {
      expect(result)
        .toEqual(3);
    });
  });

  describe('articles', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        articles: [{ id: 1337 }, { id: 420 }]
      }
    };

    beforeEach(() => {
      result = getArticles(mockHelpCenterState);
    });

    it('returns the current state of articles', () => {
      const expectation = [{ id: 1337 }, { id: 420 }];

      expect(result)
        .toEqual(expectation);
    });
  });

  describe('articleViewActive', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        activeArticle: { id: 360 }
      }
    };

    beforeEach(() => {
      result = getArticleViewActive(mockHelpCenterState);
    });

    it('returns the current state of articleViewActive', () => {
      expect(result)
        .toEqual(true);
    });
  });
});
