describe('helpCenter selectors', () => {
  let getSearchLoading,
    getArticleClicked,
    getSearchFailed,
    getSearchTerm,
    getPreviousSearchTerm,
    getHasSearched,
    getHasContextuallySearched,
    getActiveArticle,
    getResultsCount,
    getArticles,
    getArticleViewActive,
    getTotalUserSearches,
    getChannelChoiceShown,
    getSearchFieldValue;

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
    getActiveArticle = selectors.getActiveArticle;
    getResultsCount = selectors.getResultsCount;
    getArticles = selectors.getArticles;
    getArticleViewActive = selectors.getArticleViewActive;
    getTotalUserSearches = selectors.getTotalUserSearches;
    getChannelChoiceShown = selectors.getChannelChoiceShown;
    getSearchFieldValue = selectors.getSearchFieldValue;
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
    let result,
      mockHelpCenterState;

    beforeEach(() => {
      mockHelpCenterState = {
        helpCenter: {
          hasContextuallySearched: false,
          totalUserSearches: 0,
          articles: [1]
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
          hasContextuallySearched: true,
          articles: [1]
        }
      };
    });

    describe('when contextual search is true and the articles array is not empty', () => {
      beforeEach(() => {
        result = getHasContextuallySearched(mockHelpCenterState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when contextual search is false', () => {
      beforeEach(() => {
        mockHelpCenterState.helpCenter.hasContextuallySearched = false;
        result = getHasContextuallySearched(mockHelpCenterState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when the articles array is empty', () => {
      beforeEach(() => {
        mockHelpCenterState.helpCenter.articles = [];
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

  describe('channelChoiceShown', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        channelChoiceShown: true
      }
    };

    beforeEach(() => {
      result = getChannelChoiceShown(mockHelpCenterState);
    });

    it('returns the current state of channelChoiceShown', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('searchFieldValue', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        searchFieldValue: 'bob blah blerghh'
      }
    };

    beforeEach(() => {
      result = getSearchFieldValue(mockHelpCenterState);
    });

    it('returns the current state of searchFieldValue', () => {
      expect(result)
        .toEqual('bob blah blerghh');
    });
  });
});
