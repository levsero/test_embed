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

    it('dispatches an action of type SEARCH_REQUEST', () => {
      expect(action.type)
        .toEqual(actionTypes.SEARCH_REQUEST);
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
      let callbackFn;

      describe('when the request is successful', () => {
        beforeEach(() => {
          const searchRequest = httpPostSpy.calls.mostRecent().args;

          callbackFn = searchRequest[0].callbacks.done;
          callbackFn();
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type SEARCH_SUCCESS', () => {
          expect(action.type)
            .toEqual(actionTypes.SEARCH_SUCCESS);
        });
      });

      describe('when the request is unsuccessful', () => {
        beforeEach(() => {
          const searchRequest = httpPostSpy.calls.mostRecent().args;

          callbackFn = searchRequest[0].callbacks.fail;
          callbackFn();
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type SEARCH_FAILURE', () => {
          expect(action.type)
            .toEqual(actionTypes.SEARCH_FAILURE);
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

    it('dispatches an action of type CONTEXTUAL_SEARCH_REQUEST', () => {
      expect(action.type)
        .toEqual(actionTypes.CONTEXTUAL_SEARCH_REQUEST);
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
      let callbackFn;

      describe('when the request is successful', () => {
        beforeEach(() => {
          const searchRequest = httpPostSpy.calls.mostRecent().args;

          callbackFn = searchRequest[0].callbacks.done;
          callbackFn();
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type CONTEXTUAL_SEARCH_SUCCESS', () => {
          expect(action.type)
            .toEqual(actionTypes.CONTEXTUAL_SEARCH_SUCCESS);
        });
      });

      describe('when the request is unsuccessful', () => {
        beforeEach(() => {
          const searchRequest = httpPostSpy.calls.mostRecent().args;

          callbackFn = searchRequest[0].callbacks.fail;
          callbackFn();
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type SEARCH_FAILURE', () => {
          expect(action.type)
            .toEqual(actionTypes.SEARCH_FAILURE);
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
});
