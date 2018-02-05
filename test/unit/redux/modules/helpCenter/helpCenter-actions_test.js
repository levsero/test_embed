import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let mockIsOnHostMappedDomainValue,
  mockAuthenticateValue,
  mockSettingsValue,
  mockStore,
  actions,
  actionTypes;
const httpPostSpy = jasmine.createSpy('http.send');
const httpImageSpy = jasmine.createSpy('http.getImage');

describe('helpCenter redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const middlewares = [thunk];
    const createMockStore = configureMockStore(middlewares);

    mockIsOnHostMappedDomainValue = false;
    mockAuthenticateValue = '';
    mockSettingsValue = null;

    initMockRegistry({
      'service/transport': {
        http: {
          send: httpPostSpy,
          getImage: httpImageSpy
        }
      },
      'service/settings': {
        settings: {
          get: () => mockSettingsValue
        }
      },
      'service/authentication': {
        authentication: {
          getToken: () => mockAuthenticateValue
        }
      },
      'utility/globals': {
        location: {
          protocol: 'http:'
        }
      },
      'utility/pages': {
        isOnHostMappedDomain: () => mockIsOnHostMappedDomainValue
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
    const query = 'can I haz cheezburger?';

    beforeEach(() => {
      mockStore.dispatch(actions.performSearch(query));
      action = mockStore.getActions()[0];
    });

    afterEach(() => {
      httpPostSpy.calls.reset();
    });

    it('dispatches an action of type SEARCH_REQUEST_SENT', () => {
      expect(action.type)
        .toEqual(actionTypes.SEARCH_REQUEST_SENT);
    });

    it('sends a http search request with the correct params', () => {
      expect(httpPostSpy)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          method: 'get',
          path: '/api/v2/help_center/search.json',
          query
        }));
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

      it('gets the authorization header from authentication', () => {
        expect(httpPostSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            query: query
          }));
      });
    });

    describe('search response', () => {
      let callbackFn,
        actions;

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
          actions = mockStore.getActions();
        });

        it('dispatches an action of type SEARCH_REQUEST_SUCCESS', () => {
          expect(actions[1].type)
            .toEqual(actionTypes.SEARCH_REQUEST_SUCCESS);
        });
      });

      describe('when the request is unsuccessful', () => {
        beforeEach(() => {
          const searchRequest = httpPostSpy.calls.mostRecent().args;

          callbackFn = searchRequest[0].callbacks.fail;
          callbackFn();
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type SEARCH_REQUEST_FAILURE', () => {
          expect(action.type)
            .toEqual(actionTypes.SEARCH_REQUEST_FAILURE);
        });
      });
    });
  });

  describe('#performContextualSearch', () => {
    let action;
    const query = 'can I haz cheezburger?';

    beforeEach(() => {
      mockStore.dispatch(actions.performContextualSearch(query));
      action = mockStore.getActions()[0];
    });

    afterEach(() => {
      httpPostSpy.calls.reset();
    });

    it('dispatches an action of type CONTEXTUAL_SEARCH_REQUEST_SENT', () => {
      expect(action.type)
        .toEqual(actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT);
    });

    it('sends a http search request with the correct params', () => {
      expect(httpPostSpy)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          method: 'get',
          path: '/api/v2/help_center/articles/embeddable_search.json',
          query
        }));
    });

    describe('when authentication is true', () => {
      beforeEach(() => {
        mockAuthenticateValue = 'abc123';

        mockStore.dispatch(actions.performContextualSearch(query));
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

        mockStore.dispatch(actions.performContextualSearch(query));
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

        mockStore.dispatch(actions.performContextualSearch(query));
      });

      it('gets the authorization header from authentication', () => {
        expect(httpPostSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            query: query
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
      });

      describe('when the request is unsuccessful', () => {
        beforeEach(() => {
          const searchRequest = httpPostSpy.calls.mostRecent().args;

          callbackFn = searchRequest[0].callbacks.fail;
          callbackFn();
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type SEARCH_REQUEST_FAILURE', () => {
          expect(action.type)
            .toEqual(actionTypes.SEARCH_REQUEST_FAILURE);
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

  describe('#updateSearchTerm', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateSearchTerm('foobar'));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type SEARCH_BAR_CHANGED', () => {
      expect(action.type)
        .toEqual(actionTypes.SEARCH_BAR_CHANGED);
    });

    it('contains the search term in the payload', () => {
      expect(action.payload)
        .toEqual('foobar');
    });
  });

  describe('#updateViewMoreClicked', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateViewMoreClicked());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_VIEW_MORE_CLICKED', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_VIEW_MORE_CLICKED);
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

    it('dispatches an action of type NEXT_BUTTON_CLICKED', () => {
      expect(action.type)
        .toEqual(actionTypes.NEXT_BUTTON_CLICKED);
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
});
