import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../helpCenter-actions';
import * as types from '../helpCenter-action-types';
import * as baseActionTypes from 'src/redux/modules/base/base-action-types';
import * as baseSelectors from 'src/redux/modules/base/base-selectors';
import * as helpCenterSelectors from 'src/redux/modules/helpCenter/helpCenter-selectors';
import * as settingsSelectors from 'src/redux/modules/settings/settings-selectors';
import * as pages from 'utility/pages';
import { http } from 'service/transport';
import { i18n } from 'service/i18n';

jest.mock('service/transport');
jest.mock('src/redux/modules/base/base-selectors');
jest.mock('utility/pages');

const mockStore = configureMockStore([thunk]);

test('handleOriginalArticleClicked dispatches expected action', () => {
  const expected = {
    type: types.ORIGINAL_ARTICLE_CLICKED
  };

  expect(actions.handleOriginalArticleClicked())
    .toEqual(expected);
});

test('handleArticleClick dispatches expected action', () => {
  const expected = {
    type: types.ARTICLE_CLICKED,
    payload: { x: 123 }
  };

  expect(actions.handleArticleClick({ x: 123 }))
    .toEqual(expected);
});

test('resetActiveArticle dispatches expected action', () => {
  const expected = {
    type: types.ARTICLE_CLOSED
  };

  expect(actions.resetActiveArticle())
    .toEqual(expected);
});

test('addRestrictedImage dispatches expected action', () => {
  const expected = {
    type: types.ADD_RESTRICTED_IMAGE,
    payload: { x: 123 }
  };

  expect(actions.addRestrictedImage({ x: 123 }))
    .toEqual(expected);
});

test('updateChannelChoiceShown dispatches expected action', () => {
  const expected = {
    type: types.CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN,
    payload: true
  };

  expect(actions.updateChannelChoiceShown(true))
    .toEqual(expected);
});

test('handleSearchFieldChange dispatches expected action', () => {
  const expected = {
    type: types.SEARCH_FIELD_CHANGED,
    payload: { y: 1234 }
  };

  expect(actions.handleSearchFieldChange({ y: 1234 }))
    .toEqual(expected);
});

test('handleSearchFieldFocus dispatches expected action', () => {
  const expected = {
    type: types.SEARCH_FIELD_FOCUSED,
    payload: { y: 1234 }
  };

  expect(actions.handleSearchFieldFocus({ y: 1234 }))
    .toEqual(expected);
});

describe('performImageSearch', () => {
  const doneFn = jest.fn();

  it('returns expected action', () => {
    expect(actions.performImageSearch('/this/is/path', doneFn))
      .toEqual({ type: '' });
  });

  describe('http', () => {
    it('sends expected http payload', () => {
      actions.performImageSearch('/this/is/path', doneFn);
      expect(http.getImage)
        .toHaveBeenCalledWith(expect.objectContaining({
          callbacks: {
            done: doneFn
          },
          method: 'get',
          path: '/this/is/path',
          query: {},
          authorization: '',
          useHostMappingIfAvailable: undefined
        }));
    });

    it('includes auth token if available', () => {
      baseSelectors.getAuthToken.mockReturnValue('blah');
      actions.performImageSearch('/this/is/path', doneFn);
      expect(http.getImage)
        .toHaveBeenCalledWith(expect.objectContaining({
          authorization: 'Bearer blah'
        }));
    });

    it('uses host mapping if on host mapped domain', () => {
      pages.isOnHostMappedDomain.mockReturnValue(true);
      actions.performImageSearch('/this/is/path', doneFn);
      expect(http.getImage)
        .toHaveBeenCalledWith(expect.objectContaining({
          useHostMappingIfAvailable: true
        }));
    });
  });
});

describe('displayArticle', () => {
  const dispatchAction = (articleId) => {
    const store = mockStore();

    store.dispatch(actions.displayArticle(articleId));
    return store;
  };

  it('dispatches expected action', () => {
    const store = dispatchAction();

    expect(store.getActions())
      .toEqual([{
        type: types.GET_ARTICLE_REQUEST_SENT
      }]);
  });

  it('sends the expected request payload', () => {
    dispatchAction(123);

    expect(http.get)
      .toHaveBeenCalledWith(expect.objectContaining({
        callbacks: { done: expect.any(Function), fail: expect.any(Function) },
        method: 'get',
        path: '/api/v2/help_center/articles/123.json'
      }), false);
  });

  it('sends the expected request payload when not on host mapped domain', () => {
    pages.isOnHostMappedDomain.mockReturnValue(false);
    dispatchAction(123);

    expect(http.get)
      .toHaveBeenCalledWith(expect.objectContaining({
        forceHttp: false,
        useHostMappingIfAvailable: false
      }), false);
  });

  it('sends the expected request payload when on host mapped domain', () => {
    pages.isOnHostMappedDomain.mockReturnValue(true);
    dispatchAction(123);

    expect(http.get)
      .toHaveBeenCalledWith(expect.objectContaining({
        forceHttp: true,
        useHostMappingIfAvailable: true
      }), false);
  });

  const doCallback = (callbackType, args) => {
    const store = dispatchAction(345);
    const callback = http.get.mock.calls[0][0].callbacks[callbackType];

    callback(args);
    const actions = store.getActions();

    actions.shift();
    return actions;
  };

  it('dispatches expected action on failed request', () => {
    expect(doCallback('fail', { response: { x: 1 } }))
      .toEqual([
        {
          type: types.GET_ARTICLE_REQUEST_FAILURE,
          payload: { x: 1 }
        }
      ]);
  });

  it('dispatches expected action on successful request', () => {
    expect(doCallback('done', { body: { article: 'blah' } }))
      .toEqual([
        {
          type: types.GET_ARTICLE_REQUEST_SUCCESS,
          payload: 'blah'
        }
      ]);
  });
});

describe('setContextualSuggestionsManually', () => {
  it('dispatches CONTEXTUAL_SUGGESTIONS_MANUALLY_SET only when widget is not shown', () => {
    const store = mockStore();
    const options = { x: 1 };

    store.dispatch(actions.setContextualSuggestionsManually(options));
    expect(store.getActions())
      .toEqual([
        {
          payload: options,
          type: types.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET
        }
      ]);
  });

  describe('when widget has shown', () => {
    let store;
    const options = { x: 1 };
    const callback = jest.fn();
    const response = {
      body: {
        results: [],
        count: 0
      }
    };

    beforeEach(() => {
      jest.spyOn(baseSelectors, 'getHasWidgetShown').mockReturnValue(true);
      jest.spyOn(helpCenterSelectors, 'getContextualHelpRequestNeeded').mockReturnValue(true);
      jest.spyOn(baseSelectors, 'getHasPassedAuth').mockReturnValue(true);
      jest.spyOn(helpCenterSelectors, 'getSearchQuery').mockReturnValue({
        query: 'help'
      });
      jest.spyOn(settingsSelectors, 'getSettingsHelpCenterFilter').mockReturnValue(null);
      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1);
      jest.spyOn(Date, 'now').mockReturnValue(1);
      store = mockStore();

      store.dispatch(actions.setContextualSuggestionsManually(options, callback));
    });

    it('dispatches expected actions when widget has shown', () => {
      const dispatchedActions = store.getActions();

      expect(dispatchedActions[0])
        .toEqual({
          payload: options,
          type: types.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET
        });
      expect(dispatchedActions[1])
        .toEqual(expect.objectContaining({
          type: types.CONTEXTUAL_SEARCH_REQUEST_SENT
        }));
    });

    it('sends http request with expected payload', () => {
      expect(http.send)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            path: '/api/v2/help_center/articles/embeddable_search.json'
          })
        );
    });

    it('passes the callbacks as done callback to http transport', () => {
      const { callbacks } = http.send.mock.calls[0][0];

      callbacks.done(response);
      expect(callback)
        .toHaveBeenCalledWith(response);
    });

    it('passes the callbacks as fail callback to http transport', () => {
      const { callbacks } = http.send.mock.calls[0][0];

      callbacks.fail(response);
      expect(callback)
        .toHaveBeenCalledWith(response);
    });
  });
});

describe('performSearch', () => {
  const doneFn = jest.fn(),
    failFn = jest.fn(),
    helpCenterFilter = { x: 123 },
    query = { query: 'help' };

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1234);
    jest.spyOn(settingsSelectors, 'getSettingsHelpCenterFilter')
      .mockReturnValue(helpCenterFilter);
  });

  it('dispatches SEARCH_REQUEST_SENT', () => {
    const store = mockStore();

    store.dispatch(actions.performSearch(query));
    expect(store.getActions())
      .toEqual([
        {
          payload: {
            searchTerm: 'help',
            timestamp: 1234
          },
          type: types.SEARCH_REQUEST_SENT
        }
      ]);
  });

  it('sends the expected http payload', () => {
    const store = mockStore();

    store.dispatch(actions.performSearch(query, doneFn, failFn));

    expect(http.send)
      .toHaveBeenCalledWith(expect.objectContaining({
        method: 'get',
        path: '/api/v2/help_center/search.json',
        query: {
          query: 'help',
          x: 123
        }
      }));
  });

  describe('callbacks', () => {
    let store;

    beforeEach(() => {
      store = mockStore();

      store.dispatch(actions.performSearch(query, doneFn, failFn));
    });

    describe('done', () => {
      let callback;
      const response = {
        body: {
          results: [{
            locale: 'fr',
            text: 'blah'
          }],
          count: 1
        }
      };

      beforeEach(() => {
        callback = http.send.mock.calls[0][0].callbacks.done;
      });

      it('prevents execution of callback if timestamp do not matches', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(4321);
        callback(response);
        expect(store.getActions().length)
          .toEqual(1);
      });

      it('executes callback if timestamp matches', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234);
        callback(response);
        expect(doneFn)
          .toHaveBeenCalledWith(response);
      });

      it('dispatches expected action if timestamp matches', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234);
        callback(response);
        expect(store.getActions()[1])
          .toEqual({
            payload: {
              articles: [{ locale: 'fr', text: 'blah' }],
              locale: 'fr',
              resultsCount: 1
            },
            type: types.SEARCH_REQUEST_SUCCESS
          });
      });
    });

    describe('fail', () => {
      let callback,
        response = 'error';

      beforeEach(() => {
        callback = http.send.mock.calls[0][0].callbacks.fail;
      });

      it('prevents execution of callback if timestamp do not match', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(4321);
        callback(response);
        expect(store.getActions().length)
          .toEqual(1);
      });

      it('executes callback if timestamp matches', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234);
        callback(response);
        expect(failFn)
          .toHaveBeenCalledWith(response);
      });

      it('dispatches expected action if timestamp matches', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234);
        callback(response);
        expect(store.getActions()[1])
          .toEqual({
            type: types.SEARCH_REQUEST_FAILURE
          });
      });
    });
  });
});

describe('performContextualSearch', () => {
  const doneFn = jest.fn(),
    failFn = jest.fn(),
    helpCenterFilter = { x: 123 },
    query = { query: 'help' };

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1234);
    jest.spyOn(settingsSelectors, 'getSettingsHelpCenterFilter')
      .mockReturnValue(helpCenterFilter);
    jest.spyOn(helpCenterSelectors, 'getSearchQuery').mockReturnValue(query);
  });

  it('dispatches CONTEXTUAL_SEARCH_REQUEST_SENT', () => {
    const store = mockStore();

    store.dispatch(actions.performContextualSearch(query));
    expect(store.getActions())
      .toEqual([
        {
          payload: {
            searchTerm: 'help',
            timestamp: 1234
          },
          type: types.CONTEXTUAL_SEARCH_REQUEST_SENT
        }
      ]);
  });

  it('sends the expected http payload', () => {
    const store = mockStore();

    jest.spyOn(i18n, 'getLocale').mockReturnValue('fil');
    store.dispatch(actions.performContextualSearch(doneFn, failFn));
    expect(http.send)
      .toHaveBeenCalledWith(expect.objectContaining({
        method: 'get',
        path: '/api/v2/help_center/articles/embeddable_search.json',
        query: {
          query: 'help',
          x: 123,
          per_page: 3, // eslint-disable-line camelcase
          locale: 'fil'
        }
      }));
  });

  describe('callbacks', () => {
    let store;

    beforeEach(() => {
      store = mockStore();

      store.dispatch(actions.performContextualSearch(doneFn, failFn));
    });

    describe('done', () => {
      let callback;
      const response = {
        body: {
          results: [{
            locale: 'fr',
            text: 'blah'
          }],
          count: 1
        }
      };

      beforeEach(() => {
        callback = http.send.mock.calls[0][0].callbacks.done;
      });

      it('prevents execution of callback if timestamp do not matches', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(4321);
        callback(response);
        expect(store.getActions().length)
          .toEqual(1);
      });

      it('executes callback if timestamp matches', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234);
        callback(response);
        expect(doneFn)
          .toHaveBeenCalledWith(response);
      });

      it('dispatches expected action if timestamp matches', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234);
        callback(response);
        expect(store.getActions()[1])
          .toEqual({
            payload: {
              articles: [{ locale: 'fr', text: 'blah' }],
              locale: 'fr',
              resultsCount: 1
            },
            type: types.CONTEXTUAL_SEARCH_REQUEST_SUCCESS
          });
      });
    });

    describe('fail', () => {
      let callback,
        response = 'error';

      beforeEach(() => {
        callback = http.send.mock.calls[0][0].callbacks.fail;
      });

      it('prevents execution of callback if timestamp do not match', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(4321);
        callback(response);
        expect(store.getActions().length)
          .toEqual(1);
      });

      it('executes callback if timestamp matches', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234);
        callback(response);
        expect(failFn)
          .toHaveBeenCalledWith(response);
      });

      it('dispatches expected action if timestamp matches', () => {
        jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234);
        callback(response);
        expect(store.getActions()[1])
          .toEqual({
            type: types.CONTEXTUAL_SEARCH_REQUEST_FAILURE
          });
      });
    });
  });
});

describe('contextualSearch', () => {
  const callback = jest.fn();
  const helpCenterFilter = { x: 123 };
  const dispatchAction = () => {
    const store = mockStore();

    store.dispatch(actions.contextualSearch(callback));
    return store;
  };

  it('dispatches nothing if contextual help is not needed', () => {
    jest.spyOn(helpCenterSelectors, 'getContextualHelpRequestNeeded').mockReturnValue(false);
    const store = dispatchAction();

    expect(callback)
      .not.toHaveBeenCalled();
    expect(store.getActions())
      .toEqual([]);
  });

  describe('contextual help needed', () => {
    beforeEach(() => {
      jest.spyOn(helpCenterSelectors, 'getContextualHelpRequestNeeded').mockReturnValue(true);
      jest.spyOn(settingsSelectors, 'getSettingsHelpCenterFilter')
        .mockReturnValue(helpCenterFilter);
    });

    describe('has passed auth', () => {
      it('performs contextual search if auth passed', () => {
        jest.spyOn(baseSelectors, 'getHasPassedAuth').mockReturnValue(true);
        jest.spyOn(helpCenterSelectors, 'getSearchQuery').mockReturnValue({
          query: 'help'
        });
        const store = dispatchAction();

        expect(store.getActions())
          .toEqual([expect.objectContaining({
            type: types.CONTEXTUAL_SEARCH_REQUEST_SENT
          })]);
      });
    });

    describe('auth is pending', () => {
      it('updates the queue', () => {
        jest.spyOn(baseSelectors, 'getHasPassedAuth').mockReturnValue(false);
        jest.spyOn(baseSelectors, 'getIsAuthenticationPending').mockReturnValue(true);
        const store = dispatchAction();

        expect(store.getActions())
          .toEqual([
            {
              payload: {
                performContextualSearch: {}
              },
              type: baseActionTypes.UPDATE_QUEUE
            }
          ]);
      });
    });
  });
});
