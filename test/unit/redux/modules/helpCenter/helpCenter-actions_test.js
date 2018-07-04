import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let mockIsOnHostMappedDomainValue,
  mockAuthenticateValue,
  mockSettingsValue,
  mockStore,
  mockLocale,
  mockGetLastSearchTimestamp,
  actions,
  actionTypes;
const httpPostSpy = jasmine.createSpy('http.send');
const httpGetSpy = jasmine.createSpy('http.get');
const httpImageSpy = jasmine.createSpy('http.getImage');

describe('helpCenter redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const middlewares = [thunk];
    const createMockStore = configureMockStore(middlewares);

    initMockRegistry({
      'service/transport': {
        http: {
          send: httpPostSpy,
          getImage: httpImageSpy,
          get: httpGetSpy
        }
      },
      'service/settings': {
        settings: {
          get: () => mockSettingsValue
        }
      },
      'src/redux/modules/base/base-selectors': {
        getAuthToken: () => mockAuthenticateValue
      },
      'service/i18n': {
        i18n: {
          getLocale: () => mockLocale
        }
      },
      'utility/globals': {
        location: {
          protocol: 'http:'
        }
      },
      'utility/pages': {
        isOnHostMappedDomain: () => mockIsOnHostMappedDomainValue
      },
      'src/constants/helpCenter': {
        MAXIMUM_CONTEXTUAL_SEARCH_RESULTS: 3
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getLastSearchTimestamp: () => mockGetLastSearchTimestamp
      }
    });

    const actionsPath = buildSrcPath('redux/modules/helpCenter');
    const actionTypesPath = buildSrcPath('redux/modules/helpCenter/helpCenter-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({
      helpCenter: {}
    });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('#performSearch', () => {
    let action;
    const query = {
      query: 'can I haz cheezburger?'
    };

    beforeEach(() => {
      mockGetLastSearchTimestamp = Date.now();

      spyOn(Date, 'now').and.callFake(() => mockGetLastSearchTimestamp);

      mockStore.dispatch(actions.performSearch(query));
      action = mockStore.getActions()[0];
    });

    afterEach(() => {
      httpPostSpy.calls.reset();
    });

    describe('when the action is dispatched', () => {
      it('dispatches an action of type SEARCH_REQUEST_SENT', () => {
        expect(action.type)
          .toEqual(actionTypes.SEARCH_REQUEST_SENT);
      });

      it('dispatches an action with payload containing the search term', () => {
        const expected = {
          searchTerm: query.query,
          timestamp: Date.now()
        };

        expect(action.payload)
          .toEqual(expected);
      });

      it('sends a http search request with the correct params', () => {
        expect(httpPostSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            method: 'get',
            path: '/api/v2/help_center/search.json',
            query
          }));
      });
    });

    describe('when authentication is true', () => {
      beforeEach(() => {
        mockAuthenticateValue = 'abc123';

        mockStore.dispatch(actions.performSearch(query));
      });

      it('gets the authorization header from authentication', () => {
        expect(httpPostSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            authorization: 'Bearer abc123'
          }));
      });
    });

    describe('when on a hostmapped page', () => {
      beforeEach(() => {
        mockIsOnHostMappedDomainValue = true;

        mockStore.dispatch(actions.performSearch(query));
      });

      it('sets forceHttp to true', () => {
        expect(httpPostSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            forceHttp: true
          }));
      });
    });

    describe('when help center filters are part of settings', () => {
      beforeEach(() => {
        mockSettingsValue = 'filter';

        mockStore.dispatch(actions.performSearch(query));
      });

      it('includes the filter properties', () => {
        expect(httpPostSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            query: query
          }));
      });
    });

    describe('search response', () => {
      let callbackFn,
        dispatchedActions;

      describe('when the request is successful', () => {
        beforeEach(() => {
          const searchRequest = httpPostSpy.calls.mostRecent().args;
          const mockResponse = {
            body: {
              results: [{ id: 1337 }, { id: 420 }, { id: 360 }],
              count: 3
            }
          };

          callbackFn = searchRequest[0].callbacks.done;
          callbackFn(mockResponse);
          dispatchedActions = mockStore.getActions();
        });

        it('dispatches an action of type SEARCH_REQUEST_SUCCESS', () => {
          expect(dispatchedActions[1].type)
            .toEqual(actionTypes.SEARCH_REQUEST_SUCCESS);
        });
      });

      describe('when the request is unsuccessful', () => {
        beforeEach(() => {
          const searchRequest = httpPostSpy.calls.mostRecent().args;

          callbackFn = searchRequest[0].callbacks.fail;
          callbackFn();
          dispatchedActions = mockStore.getActions();
        });

        it('dispatches an action of type SEARCH_REQUEST_FAILURE', () => {
          expect(dispatchedActions[1].type)
            .toEqual(actionTypes.SEARCH_REQUEST_FAILURE);
        });
      });
    });
  });

  describe('#performContextualSearch', () => {
    let action,
      doneSpy,
      failSpy,
      options = {
        search: 'yolo'
      },
      pageKeywords = 'https github com zendesk embeddable framework blob master src component helpCenter HelpCenter';

    beforeEach(() => {
      mockGetLastSearchTimestamp = Date.now();

      spyOn(Date, 'now').and.callFake(() => mockGetLastSearchTimestamp);

      doneSpy = jasmine.createSpy('done');
      failSpy = jasmine.createSpy('fail');
      mockLocale = 'yoloLocale';
      mockStore.dispatch(actions.performContextualSearch(options, doneSpy, failSpy));
      action = mockStore.getActions()[0];
    });

    afterEach(() => {
      httpPostSpy.calls.reset();
    });

    it('sends a http search request with the correct params', () => {
      /* eslint camelcase:0 */
      expect(httpPostSpy)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          method: 'get',
          path: '/api/v2/help_center/articles/embeddable_search.json',
          query: jasmine.objectContaining({
            query: 'yolo',
            locale: 'yoloLocale',
            per_page: 3
          })
        }));
    });

    describe('invalid options provided', () => {
      beforeAll(() => {
        options = {};
      });

      it('does not dispatch an action of type CONTEXTUAL_SEARCH_REQUEST_SENT', () => {
        expect(action)
          .toBeUndefined();
      });
    });

    describe('options.search exists', () => {
      beforeAll(() => {
        options = {
          search: 'yolo',
          labels: ['authy', 'authy2'],
          url: true,
          pageKeywords
        };
      });

      it('dispatches an action of type CONTEXTUAL_SEARCH_REQUEST_SENT', () => {
        expect(action.type)
          .toEqual(actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT);
      });

      it('dispatches an action with payload containing the search term', () => {
        const expected = {
          searchTerm: 'yolo',
          timestamp: mockGetLastSearchTimestamp
        };

        expect(action.payload)
          .toEqual(expected);
      });
    });

    describe('options.labels exists', () => {
      beforeAll(() => {
        options = {
          labels: ['authy', 'authy2'],
          url: true,
          pageKeywords
        };
      });

      it('dispatches an action of type CONTEXTUAL_SEARCH_REQUEST_SENT', () => {
        expect(action.type)
          .toEqual(actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT);
      });

      it('dispatches an action with payload containing labels joined into a string', () => {
        const expected = {
          searchTerm: 'authy,authy2',
          timestamp: mockGetLastSearchTimestamp
        };

        expect(action.payload)
          .toEqual(expected);
      });
    });

    describe('options.pageKeyWords exists', () => {
      beforeAll(() => {
        options = {
          url: true,
          pageKeywords
        };
      });

      it('dispatches an action of type CONTEXTUAL_SEARCH_REQUEST_SENT', () => {
        expect(action.type)
          .toEqual(actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT);
      });

      it('dispatches an action with payload containing the page keywords as the search term', () => {
        const expected = {
          searchTerm: pageKeywords,
          timestamp: mockGetLastSearchTimestamp
        };

        expect(action.payload)
          .toEqual(expected);
      });
    });

    describe('when authentication is true', () => {
      beforeAll(() => {
        mockAuthenticateValue = 'abc123';
      });

      it('gets the authorization header from authentication', () => {
        expect(httpPostSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            authorization: 'Bearer abc123'
          }));
      });
    });

    describe('when on a hostmapped page', () => {
      beforeAll(() => {
        mockIsOnHostMappedDomainValue = true;
      });

      it('sets forceHttp to true', () => {
        expect(httpPostSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            forceHttp: true
          }));
      });
    });

    describe('when help center filters are part of settings', () => {
      beforeAll(() => {
        mockSettingsValue = {
          section: 'filter'
        };
      });

      it('includes the filter properties', () => {
        expect(httpPostSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            query: jasmine.objectContaining({
              section: 'filter'
            })
          }));
      });
    });

    describe('search response', () => {
      let callbackFn,
        mockResponse;

      describe('when the request is successful', () => {
        beforeEach(() => {
          const searchRequest = httpPostSpy.calls.mostRecent().args;

          mockResponse = { body: { count: 1 } };
          callbackFn = searchRequest[0].callbacks.done;
          callbackFn(mockResponse);
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type CONTEXTUAL_SEARCH_REQUEST_SUCCESS', () => {
          expect(action.type)
            .toEqual(actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS);
        });

        it('dispatches an action with a payload containing the count', () => {
          expect(action.payload.resultsCount)
            .toEqual(1);
        });

        it('calls done callback with correct params', () => {
          expect(doneSpy)
            .toHaveBeenCalledWith(mockResponse);
        });
      });

      describe('when the request is unsuccessful', () => {
        beforeEach(() => {
          const searchRequest = httpPostSpy.calls.mostRecent().args;

          mockResponse = { 'error': 'error' };
          callbackFn = searchRequest[0].callbacks.fail;
          callbackFn(mockResponse);
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type CONTEXTUAL_SEARCH_REQUEST_FAILURE', () => {
          expect(action.type)
            .toEqual(actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE);
        });

        it('calls fail callback with correct params', () => {
          expect(failSpy)
            .toHaveBeenCalledWith(mockResponse);
        });
      });
    });
  });

  describe('#performImageSearch', () => {
    const path = '/image/123';

    beforeEach(() => {
      actions.performImageSearch(path);
    });

    afterEach(() => {
      httpImageSpy.calls.reset();
    });

    it('sends a http images request with the correct params', () => {
      expect(httpImageSpy)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          method: 'get',
          path
        }));
    });

    describe('when authentication is true', () => {
      beforeEach(() => {
        mockAuthenticateValue = 'abc123';

        actions.performImageSearch(path);
      });

      it('gets the authorization header from authentication', () => {
        expect(httpImageSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            authorization: 'Bearer abc123'
          }));
      });
    });

    describe('when on a hostmapped page', () => {
      beforeEach(() => {
        mockIsOnHostMappedDomainValue = true;

        actions.performImageSearch(path);
      });

      it('sets forceHttp to true', () => {
        expect(httpImageSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            forceHttp: true
          }));
      });
    });
  });

  describe('#handleArticleClick', () => {
    let action,
      mockArticle;

    beforeEach(() => {
      mockArticle = {
        id: 1,
        body: '<p>Oh mai gawdddddddddddd</p>'
      };

      mockStore.dispatch(actions.handleArticleClick(mockArticle));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type ARTICLE_CLICKED', () => {
      expect(action.type)
        .toEqual(actionTypes.ARTICLE_CLICKED);
    });

    it('contains the article in the payload', () => {
      expect(action.payload)
        .toEqual(mockArticle);
    });
  });

  describe('#resetActiveArticle', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.resetActiveArticle());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type ARTICLE_CLOSED', () => {
      expect(action.type)
        .toEqual(actionTypes.ARTICLE_CLOSED);
    });
  });

  describe('#handleOriginalArticleClicked', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.handleOriginalArticleClicked());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type ORIGINAL_ARTICLE_CLICKED', () => {
      expect(action.type)
        .toEqual(actionTypes.ORIGINAL_ARTICLE_CLICKED);
    });
  });

  describe('#addRestrictedImage', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.addRestrictedImage({
        'http://img.lnk': 'blob:http://img.lnk'
      }));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type ADD_RESTRICTED_IMAGE', () => {
      expect(action.type)
        .toEqual(actionTypes.ADD_RESTRICTED_IMAGE);
    });

    it('contains the search term in the payload', () => {
      expect(action.payload)
        .toEqual({
          'http://img.lnk': 'blob:http://img.lnk'
        });
    });
  });

  describe('#updateChannelChoiceShown', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateChannelChoiceShown(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN', () => {
      expect(action.type)
        .toEqual(actionTypes.CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN);
    });

    it('contains the boolean value in the payload', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });

  describe('#handleSearchFieldChange', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.handleSearchFieldChange('bla bla bla'));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type SEARCH_FIELD_CHANGED', () => {
      expect(action.type)
        .toEqual(actionTypes.SEARCH_FIELD_CHANGED);
    });

    it('contains the search field value in the payload', () => {
      expect(action.payload)
        .toEqual('bla bla bla');
    });
  });

  describe('#handleSearchFieldFocus', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.handleSearchFieldFocus(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type SEARCH_FIELD_FOCUSED', () => {
      expect(action.type)
        .toEqual(actionTypes.SEARCH_FIELD_FOCUSED);
    });

    it('contains the search focused state in the payload', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });

  describe('#displayArticle', () => {
    let action;

    beforeEach(() => {
      mockIsOnHostMappedDomainValue = true;
      mockStore.dispatch(actions.displayArticle(123));
      action = mockStore.getActions()[0];
    });

    afterEach(() => {
      httpGetSpy.calls.reset();
    });

    it('dispatches an action of type GET_ARTICLE_REQUEST_SENT', () => {
      expect(action.type)
        .toEqual(actionTypes.GET_ARTICLE_REQUEST_SENT);
    });

    it('sends a http search request with the correct params', () => {
      expect(httpGetSpy)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          method: 'get',
          path: '/api/v2/help_center/articles/123.json',
          useHostMappingIfAvailable: true,
          callbacks: {
            done: jasmine.any(Function),
            fail: jasmine.any(Function)
          }
        }), false);
    });
  });
});
