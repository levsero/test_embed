describe('blip middleware', () => {
  let sendBlips,
    beaconSpy,
    i18nSpy;
  const TALK_CALLBACK_SUCCESS = 'widget/talk/TALK_CALLBACK_SUCCESS';
  const UPDATE_ACTIVE_EMBED = 'widget/base/UPDATE_ACTIVE_EMBED';
  const ARTICLE_CLICKED = 'widget/helpCenter/ARTICLE_CLICKED';
  const ORIGINAL_ARTICLE_CLICKED = 'widget/helpCenter/ORIGINAL_ARTICLE_CLICKED';
  const SEARCH_REQUEST_SUCCESS = 'widget/helpCenter/SEARCH_REQUEST_SUCCESS';
  const SEARCH_REQUEST_FAILURE = 'widget/helpCenter/SEARCH_REQUEST_FAILURE';

  beforeEach(() => {
    const blipPath = buildSrcPath('redux/middleware/blip');

    beaconSpy = jasmine.createSpyObj('beacon', ['trackUserAction']);
    i18nSpy = jasmine.createSpyObj('i18n', ['getLocale']);
    i18nSpy.getLocale.and.callFake(() => 'US');

    mockery.enable();
    initMockRegistry({
      'service/beacon': {
        beacon: beaconSpy
      },
      'service/i18n': {
        i18n: i18nSpy
      },
      'src/redux/modules/talk/talk-selectors': {
        getEmbeddableConfig: _.identity,
        getAgentAvailability: (prevState) => prevState.agentAvailability,
        getFormState: _.identity,
        getAverageWaitTime: (prevState) => prevState.averageWaitTime
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getTotalUserSearches: (prevState) => prevState.totalUserSearches,
        getSearchTerm: (prevState) => prevState.searchTerm,
        getResultsCount: (prevState) => prevState.resultsCount,
        getArticleClicked: (prevState) => prevState.articleClicked,
        getActiveArticle: (prevState) => prevState.activeArticle,
        getHasContextuallySearched: (prevState) => prevState.hasContextuallySearched
      },
      'src/redux/modules/talk/talk-action-types': {
        TALK_CALLBACK_SUCCESS: TALK_CALLBACK_SUCCESS
      },
      'src/redux/modules/helpCenter/helpCenter-action-types': {
        'ARTICLE_CLICKED': ARTICLE_CLICKED,
        'ORIGINAL_ARTICLE_CLICKED': ORIGINAL_ARTICLE_CLICKED,
        'SEARCH_REQUEST_SUCCESS': SEARCH_REQUEST_SUCCESS,
        'SEARCH_REQUEST_FAILURE': SEARCH_REQUEST_FAILURE
      },
      'src/redux/modules/base/base-action-types': {
        UPDATE_ACTIVE_EMBED: UPDATE_ACTIVE_EMBED
      }
    });

    sendBlips = requireUncached(blipPath).sendBlips;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('sendBlips', () => {
    let action,
      nextSpy;

    describe('next', () => {
      beforeEach(() => {
        const flatState = {};

        nextSpy = jasmine.createSpy('nextSpy');
        action = { type: 'random_type'};
        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls next function', () => {
        expect(nextSpy)
          .toHaveBeenCalledWith({ type: 'random_type'});
      });
    });

    describe('action has type TALK_CALLBACK_SUCCESS', () => {
      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        action = { type: TALK_CALLBACK_SUCCESS };
        nextSpy = jasmine.createSpy('nextSpy');
        const flatState = {
          phone: '+61430919721',
          name: 'Johnny',
          email: 'Johnny@john.com',
          description: 'Please help me.',
          keywords: ['Support'],
          groupName: 'Support',
          supportedCountries: '1, 10, 9, 89',
          averageWaitTime: 10,
          agentAvailability: true
        };

        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls trackUserAction with the correct params', () => {
        const expectedValue = {
          supportedCountries: '1, 10, 9, 89',
          groupName: 'Support',
          keywords: ['Support'],
          phoneNumber: '+61430919721',
          averageWaitTime: 10,
          agentAvailability: true,
          user: {
            name: 'Johnny',
            email: 'Johnny@john.com',
            description: 'Please help me.'
          },
          locale: 'US'
        };

        expect(beaconSpy.trackUserAction)
          .toHaveBeenCalledWith('talk', 'request', 'callbackForm', expectedValue);
      });
    });

    describe('action has type UPDATE_ACTIVE_EMBED', () => {
      let flatState;

      beforeEach(() => {
        flatState = {
          phoneNumber: '+61430919721',
          keywords: ['Support'],
          groupName: 'Support',
          supportedCountries: '1, 10, 9, 89',
          averageWaitTime: 10,
          agentAvailability: true
        };

        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
      });

      describe('payload is talk', () => {
        beforeEach(() => {
          action = {
            type: UPDATE_ACTIVE_EMBED,
            payload: 'talk'
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('calls trackUserAction with the correct params', () => {
          const expectedValue = {
            supportedCountries: '1, 10, 9, 89',
            groupName: 'Support',
            keywords: ['Support'],
            phoneNumber: '+61430919721',
            averageWaitTime: 10,
            agentAvailability: true,
            locale: 'US'
          };

          expect(beaconSpy.trackUserAction)
            .toHaveBeenCalledWith('talk', 'opened', 'phoneNumber', expectedValue);
        });
      });

      describe('payload is not talk', () => {
        beforeEach(() => {
          action = {
            type: UPDATE_ACTIVE_EMBED,
            payload: 'chat'
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('action has type ARTICLE_CLICKED', () => {
      let flatState;

      beforeEach(() => {
        flatState = {
          searchTerm: 'i made a query...',
          resultsCount: 5,
          articleClicked: false,
          hasContextuallySearched: false
        };

        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
      });

      describe('latest article is not null', () => {
        beforeEach(() => {
          action = {
            type: ARTICLE_CLICKED,
            payload: { id: 121212112 }
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('calls trackUserAction with the correct params', () => {
          const expectedValue = {
            query: 'i made a query...',
            resultsCount: 3,
            uniqueSearchResultClick: true,
            articleId: 121212112,
            locale: 'US',
            contextualSearch: false
          };

          expect(beaconSpy.trackUserAction)
            .toHaveBeenCalledWith('helpCenter', 'click', 'helpCenterForm', expectedValue);
        });
      });

      describe('latest article is null', () => {
        beforeEach(() => {
          action = {
            type: ARTICLE_CLICKED,
            payload: null
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('action has type SEARCH_REQUEST_SUCCESS', () => {
      let flatState;

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
      });

      describe('total user searches previously is 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 0,
            searchTerm: 'i made a query...'
          };
          action = {
            type: SEARCH_REQUEST_SUCCESS
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('calls trackUserAction with the correct params', () => {
          expect(beaconSpy.trackUserAction)
            .toHaveBeenCalledWith('helpCenter', 'search', 'helpCenterForm', 'i made a query...');
        });
      });

      describe('total searches previously is not 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 100,
            searchTerm: 'i made a query...'
          };
          action = {
            type: SEARCH_REQUEST_SUCCESS
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('action has type SEARCH_REQUEST_FAILURE', () => {
      let flatState;

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
      });

      describe('total user searches previously is 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 0,
            searchTerm: 'i made a query...'
          };
          action = {
            type: SEARCH_REQUEST_FAILURE
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('calls trackUserAction with the correct params', () => {
          expect(beaconSpy.trackUserAction)
            .toHaveBeenCalledWith('helpCenter', 'search', 'helpCenterForm', 'i made a query...');
        });
      });

      describe('total searches previously is not 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 100,
            searchTerm: 'i made a query...'
          };
          action = {
            type: SEARCH_REQUEST_FAILURE
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('action has type ORIGINAL_ARTICLE_CLICKED', () => {
      let flatState;

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
        flatState = {
          activeArticle: { id: 1213211232123 },
          resultsCount: 1,
          searchTerm: 'i made a query...',
          articleClicked: true,
          hasContextuallySearched: true
        };
        action = {
          type: ORIGINAL_ARTICLE_CLICKED
        };
        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls trackUserAction with the correct params', () => {
        const expectedValue = {
          query: 'i made a query...',
          resultsCount: 1,
          uniqueSearchResultClick: false,
          articleId: 1213211232123,
          locale: 'US',
          contextualSearch: true
        };

        expect(beaconSpy.trackUserAction)
          .toHaveBeenCalledWith('helpCenter', 'viewOriginalArticle', 'helpCenterForm', expectedValue);
      });
    });

    describe('action does not have any relevant action type', () => {
      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        action = { type: 'random_type' };
        sendBlips({ getState: () => ({}) })(nextSpy)(action);
      });

      it('does not call trackUserAction', () => {
        expect(beaconSpy.trackUserAction)
          .not.toHaveBeenCalled();
      });
    });
  });
});
