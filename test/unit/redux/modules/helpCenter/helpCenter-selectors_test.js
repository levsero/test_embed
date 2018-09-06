describe('helpCenter selectors', () => {
  let getSearchLoading,
    getArticleClicked,
    getSearchFailed,
    getSearchTerm,
    getPreviousSearchTerm,
    getHasSearched,
    getHasContextuallySearched,
    getIsContextualSearchPending,
    getIsContextualSearchSuccessful,
    getIsContextualSearchFailure,
    getActiveArticle,
    getResultsCount,
    getResultsLocale,
    getArticles,
    getArticleViewActive,
    getTotalUserSearches,
    getChannelChoiceShown,
    getArticleDisplayed,
    getSearchFieldValue,
    getSearchFieldFocused,
    getIsContextualSearchComplete,
    getManualContextualSuggestions,
    getSearchQuery,
    getContextualHelpRequestNeeded,
    mockPageKeywords,
    mockIsOnHelpCenterPage,
    mockHelpCenterContextualEnabled;

  const contextualSearchRequestPending = 'CONTEXTUAL_SEARCH_REQUEST_SENT';
  const contextualSearchRequestSuccess = 'CONTEXTUAL_SEARCH_REQUEST_SUCCESS';
  const contextualSearchRequestFailure = 'CONTEXTUAL_SEARCH_REQUEST_FAILURE';

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'src/redux/modules/helpCenter/helpCenter-action-types': {
        CONTEXTUAL_SEARCH_REQUEST_SENT: contextualSearchRequestPending,
        CONTEXTUAL_SEARCH_REQUEST_SUCCESS: contextualSearchRequestSuccess,
        CONTEXTUAL_SEARCH_REQUEST_FAILURE: contextualSearchRequestFailure
      },
      'utility/utils': {
        getPageKeywords: () => mockPageKeywords
      },
      'utility/pages': {
        isOnHelpCenterPage: () => mockIsOnHelpCenterPage
      },
      'src/redux/modules/base/base-selectors': {
        getHelpCenterContextualEnabled: () => mockHelpCenterContextualEnabled
      }
    });

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
    getIsContextualSearchPending = selectors.getIsContextualSearchPending;
    getIsContextualSearchSuccessful = selectors.getIsContextualSearchSuccessful;
    getActiveArticle = selectors.getActiveArticle;
    getResultsCount = selectors.getResultsCount;
    getResultsLocale = selectors.getResultsLocale;
    getArticles = selectors.getArticles;
    getArticleViewActive = selectors.getArticleViewActive;
    getTotalUserSearches = selectors.getTotalUserSearches;
    getChannelChoiceShown = selectors.getChannelChoiceShown;
    getSearchFieldValue = selectors.getSearchFieldValue;
    getSearchFieldFocused = selectors.getSearchFieldFocused;
    getArticleDisplayed = selectors.getArticleDisplayed;
    getIsContextualSearchFailure = selectors.getIsContextualSearchFailure;
    getIsContextualSearchComplete = selectors.getIsContextualSearchComplete;
    getManualContextualSuggestions = selectors.getManualContextualSuggestions;
    getSearchQuery = selectors.getSearchQuery;
    getContextualHelpRequestNeeded = selectors.getContextualHelpRequestNeeded;
  });

  describe('getContextualHelpRequestNeeded', () => {
    let result,
      mockManualContextualSuggestions;

    beforeEach(() => {
      let mockState = {
        helpCenter: {
          manualContextualSuggestions: mockManualContextualSuggestions
        }
      };

      result = getContextualHelpRequestNeeded(mockState);
    });

    describe('when manual contextual suggestions search term is present', () => {
      beforeAll(() => {
        mockManualContextualSuggestions = {
          query: 'yolo'
        };
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when manual contextual suggestions labels is present', () => {
      beforeAll(() => {
        mockManualContextualSuggestions = {
          labels: ['yo', 'lo']
        };
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when manual contextual suggestions url is present', () => {
      beforeAll(() => {
        mockManualContextualSuggestions = {
          url: true
        };
      });

      describe('when getPageKeywords returns a value', () => {
        beforeAll(() => {
          mockPageKeywords = 'pageKeyword';
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when getPageKeywords does not return a value', () => {
        beforeAll(() => {
          mockPageKeywords = '';
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });

    describe('when manual contextual suggestions is not present', () => {
      beforeAll(() => {
        mockManualContextualSuggestions = {};
      });

      describe('when contextual help enabled', () => {
        beforeAll(() => {
          mockHelpCenterContextualEnabled = true;
        });

        describe('when not on help center page', () => {
          beforeAll(() => {
            mockIsOnHelpCenterPage = false;
          });

          describe('when there are valid pageKeywords', () => {
            beforeAll(() => {
              mockPageKeywords = 'omg why';
            });

            it('returns true', () => {
              expect(result)
                .toEqual(true);
            });
          });

          describe('when there are no valid pageKeywords', () => {
            beforeAll(() => {
              mockPageKeywords = '';
            });

            it('returns false', () => {
              expect(result)
                .toEqual(false);
            });
          });
        });
      });

      describe('when contextual help not enabled', () => {
        beforeAll(() => {
          mockHelpCenterContextualEnabled = false;
          mockIsOnHelpCenterPage = false;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('when on help center page', () => {
        beforeAll(() => {
          mockIsOnHelpCenterPage = true;
          mockHelpCenterContextualEnabled = true;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });
  });

  describe('getSearchQuery', () => {
    let result,
      mockManualContextualSuggestions;

    beforeEach(() => {
      let mockState = {
        helpCenter: {
          manualContextualSuggestions: mockManualContextualSuggestions
        }
      };

      result = getSearchQuery(mockState);
    });

    describe('when search term is present', () => {
      beforeAll(() => {
        mockManualContextualSuggestions = {
          query: 'yolo'
        };
      });

      it('returns the correct search query', () => {
        expect(result)
          .toEqual({
            query: 'yolo'
          });
      });
    });

    describe('when labels are present', () => {
      beforeAll(() => {
        mockManualContextualSuggestions = {
          labels: ['y', 'o', 'l', 'o']
        };
      });

      it('returns the correct search query', () => {
        /* eslint camelcase:0 */
        expect(result)
          .toEqual({
            label_names: 'y,o,l,o'
          });
      });
    });

    describe('when no manual contextual suggestions present', () => {
      beforeAll(() => {
        mockManualContextualSuggestions = {};
        mockPageKeywords = 'pageKeyword';
      });

      it('returns the correct search query', () => {
        expect(result)
          .toEqual({
            query: 'pageKeyword'
          });
      });
    });
  });

  describe('getManualContextualSuggestions', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        manualContextualSuggestions: {
          query: 'yolo'
        }
      }
    };

    beforeEach(() => {
      result = getManualContextualSuggestions(mockHelpCenterState);
    });

    it('returns the current state of manualContextualSuggestions', () => {
      expect(result)
        .toEqual({
          query: 'yolo'
        });
    });
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
          contextualSearch: {
            hasSearched: false,
          },
          totalUserSearches: 0,
          articles: [1]
        }
      };
    });

    describe('when contextualSearch.hasSearched is true', () => {
      beforeEach(() => {
        mockHelpCenterState.helpCenter.contextualSearch.hasSearched = true;
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

    describe('when contextualSearch.hasSearched is false', () => {
      beforeEach(() => {
        mockHelpCenterState.helpCenter.contextualSearch.hasSearched = false;
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
          contextualSearch: {
            hasSearched: true
          }
        }
      };

      result = getHasContextuallySearched(mockHelpCenterState);
    });

    it('returns the current state of hasSearched', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getIsContextualSearchPending', () => {
    let result,
      mockContextualSearchScreen;

    beforeEach(() => {
      const mockHelpCenterState = {
        helpCenter: {
          contextualSearch: {
            screen: mockContextualSearchScreen
          }
        }
      };

      result = getIsContextualSearchPending(mockHelpCenterState);
    });

    describe('when contextual search screen is pending', () => {
      beforeAll(() => {
        mockContextualSearchScreen = contextualSearchRequestPending;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when contextual search screen is not pending', () => {
      beforeAll(() => {
        mockContextualSearchScreen = contextualSearchRequestSuccess;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getIsContextualSearchSuccessful', () => {
    let result,
      mockContextualSearchScreen;

    beforeEach(() => {
      const mockHelpCenterState = {
        helpCenter: {
          contextualSearch: {
            screen: mockContextualSearchScreen
          }
        }
      };

      result = getIsContextualSearchSuccessful(mockHelpCenterState);
    });

    describe('when contextual search screen is successful', () => {
      beforeAll(() => {
        mockContextualSearchScreen = contextualSearchRequestSuccess;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when contextual search screen is not successful', () => {
      beforeAll(() => {
        mockContextualSearchScreen = contextualSearchRequestPending;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getIsContextualSearchFailure', () => {
    let result,
      mockContextualSearchScreen;

    beforeEach(() => {
      const mockHelpCenterState = {
        helpCenter: {
          contextualSearch: {
            screen: mockContextualSearchScreen
          }
        }
      };

      result = getIsContextualSearchFailure(mockHelpCenterState);
    });

    describe('when contextual search screen is a failure', () => {
      beforeAll(() => {
        mockContextualSearchScreen = contextualSearchRequestFailure;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when contextual search screen is not a failure', () => {
      beforeAll(() => {
        mockContextualSearchScreen = contextualSearchRequestSuccess;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getIsContextualSearchComplete', () => {
    let result,
      mockContextualSearchScreen;

    beforeEach(() => {
      const mockHelpCenterState = {
        helpCenter: {
          contextualSearch: {
            screen: mockContextualSearchScreen
          }
        }
      };

      result = getIsContextualSearchComplete(mockHelpCenterState);
    });

    describe('when contextual search screen is a failure', () => {
      beforeAll(() => {
        mockContextualSearchScreen = contextualSearchRequestFailure;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when contextual search screen is a success', () => {
      beforeAll(() => {
        mockContextualSearchScreen = contextualSearchRequestSuccess;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when contextual search screen is pending', () => {
      beforeAll(() => {
        mockContextualSearchScreen = contextualSearchRequestPending;
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

  describe('getResultsLocale', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        resultsLocale: 'de'
      }
    };

    beforeEach(() => {
      result = getResultsLocale(mockHelpCenterState);
    });

    it('returns the current state of resultsLocale', () => {
      expect(result)
        .toEqual('de');
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

  describe('getSearchFieldFocused', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        searchFieldFocused: true
      }
    };

    beforeEach(() => {
      result = getSearchFieldFocused(mockHelpCenterState);
    });

    it('returns the current state of searchFieldFocused', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getArticleDisplayed', () => {
    let result;
    const mockHelpCenterState = {
      helpCenter: {
        articleDisplayed: true
      }
    };

    beforeEach(() => {
      result = getArticleDisplayed(mockHelpCenterState);
    });

    it('returns the current state of articleDisplayed', () => {
      expect(result)
        .toEqual(true);
    });
  });
});
