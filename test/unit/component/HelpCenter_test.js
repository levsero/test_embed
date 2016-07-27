fdescribe('HelpCenter component', function() {
  let HelpCenter,
    mockRegistry,
    mockPageKeywords,
    trackSearch,
    updateResults,
    manualSearch;

  const searchFieldBlur = jasmine.createSpy();
  const searchFieldGetValue = jasmine.createSpy().and.returnValue('Foobar');
  const helpCenterPath = buildSrcPath('component/HelpCenter');

  beforeEach(function() {
    trackSearch = jasmine.createSpy('trackSearch');
    updateResults = jasmine.createSpy('updateResults');
    manualSearch = jasmine.createSpy('manualSearch');

    resetDOM();

    mockery.enable();

    mockPageKeywords = 'billy bob thorton';

    mockRegistry = initMockRegistry({
      'React': React,
      'component/HelpCenterArticle': {
        HelpCenterArticle: React.createClass({
          render: function() {
            return <div className='UserContent' />;
          }
        })
      },
      'component/HelpCenterResults': {
        HelpCenterResults: React.createClass({
          render: function() {
            return <div className='HelpCenterResults' />;
          }
        })
      },
      'component/HelpCenterDesktop': {
        HelpCenterDesktop: React.createClass({
          focusField: function() {
            return;
          },
          render: function() {
            return (
              <div ref='searchField' type='search'>
                <input ref='searchFieldInput' value='' type='search' />
              </div>
            );
          }
        })
      },
      'component/HelpCenterMobile': {
        HelpCenterMobile: noopReactComponent()
      },
      'component/Container': {
        Container: React.createClass({
          render: function() {
            return <div>{this.props.children}</div>;
          }
        })
      },
      'service/i18n': {
        i18n: {
          init: jasmine.createSpy(),
          setLocale: jasmine.createSpy(),
          getLocale: jasmine.createSpy(),
          isRTL: jasmine.createSpy(),
          t: _.identity
        }
      },
      'utility/globals': {
        win: window,
        document: document
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    mockery.registerAllowable(helpCenterPath);

    HelpCenter = requireUncached(helpCenterPath).HelpCenter;

    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('initial state', () => {
    let helpCenter;

    beforeEach(() => {
      helpCenter = instanceRender(<HelpCenter buttonLabelKey='contact' />);
    });

    it('has articles set to empty', () => {
      expect(helpCenter.state.articles)
        .toEqual([]);
    });

    it('has buttonLabel reflecting buttonLabelKey prop', () => {
      expect(helpCenter.state.buttonLabel)
        .toEqual('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact');
    });
  });

  it('should call i18n.t with the right parameter to set the label', function() {
    const labelKey = 'foo bar';

    spyOn(mockRegistry['service/i18n'].i18n, 't').and.callThrough();

    shallowRender(<HelpCenter buttonLabelKey={labelKey} />);

    expect(mockRegistry['service/i18n'].i18n.t)
      .toHaveBeenCalledWith(`embeddable_framework.helpCenter.submitButton.label.submitTicket.${labelKey}`);
  });

  describe('updateResults', function() {
    let helpCenter,
      mockShowBackButton,
      responsePayloadResults;

    beforeEach(function() {
      mockShowBackButton = jasmine.createSpy('mockShowBackButton');

      helpCenter = domRender(<HelpCenter showBackButton={mockShowBackButton} />);

      responsePayloadResults = { ok: true, body: { results: [1, 2, 3], count: 3 } };
      helpCenter.updateResults(responsePayloadResults);
    });

    it('should set states matching the response with results', function() {
      expect(helpCenter.state.articles)
        .toEqual(responsePayloadResults.body.results);

      expect(helpCenter.state.resultsCount)
        .toEqual(responsePayloadResults.body.count);

      expect(helpCenter.state.articleViewActive)
        .toEqual(false);
    });

    it('should call props.showBackButton', function() {
      expect(mockShowBackButton)
        .toHaveBeenCalledWith(false);
    });

    it('should set states matching the response without results', function() {
      const responsePayloadNoResults = { ok: true, body: { results: [], count: 0 } };

      helpCenter.updateResults(responsePayloadNoResults);

      expect(helpCenter.state.articles)
        .toEqual(responsePayloadNoResults.body.results);

      expect(helpCenter.state.resultsCount)
        .toEqual(responsePayloadNoResults.body.count);
    });
  });

  describe('searchFail', function() {
    it('should set states accordingly to the search failure', function() {
      const searchTerm = 'abcd';
      const helpCenter = domRender(<HelpCenter />);

      helpCenter.setState({ searchTerm: searchTerm });

      helpCenter.searchFail();

      expect(helpCenter.state.isLoading)
        .toBeFalsy();

      expect(helpCenter.state.previousSearchTerm)
        .toEqual(searchTerm);

      expect(helpCenter.state.hasSearched)
        .toBeTruthy();

      expect(helpCenter.state.searchFailed)
        .toBeTruthy();
    });
  });

  describe('contextualSearch', function() {
    const responsePayloadResults = {ok: true, body: {results: [1, 2, 3], count: 3}};
    const responsePayloadNoResults = {ok: true, body: {results: [], count: 0}};

    let helpCenter,
      mockContextualSearchSender;

    beforeEach(function() {
      mockContextualSearchSender = jasmine.createSpy('mockContextualSearchSender');

      helpCenter = domRender(<HelpCenter contextualSearchSender={mockContextualSearchSender}/>);
    });

    it('should call contextualSearchSender', function() {
      helpCenter.contextualSearch({ search: 'foo bar' });

      expect(mockContextualSearchSender)
        .toHaveBeenCalled();
    });

    it('should call contextualSearchSender with the right payload for search attribute', function() {
      const searchOptions = { search: 'foo bar' };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs.query)
        .toEqual(searchOptions.search);

      expect(recentCallArgs.label_names)
        .toBeFalsy();
    });

    it('should call contextualSearchSender with the right payload for labels attribute', function() {
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          label_names: searchOptions.labels.join(',')
        }));
    });

    it('should call contextualSearchSender with the right payload for search and labels attribute', function() {
      const searchOptions = {
        search: 'my search',
        labels: ['foo', 'bar']
      };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search
        }));
    });

    it('should call contextualSearchSender with the right payload for search, labels and url attribute', function() {
      const searchOptions = {
        search: 'my search',
        labels: ['foo', 'bar'],
        url: true,
        pageKeywords: mockPageKeywords
      };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search
        }));
    });

    it('should call contextualSearchSender with the right payload for labels and url attribute', function() {
      const searchOptions = {
        labels: ['foo', 'bar'],
        url: true,
        pageKeywords: mockPageKeywords
      };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          label_names: searchOptions.labels.join(',')
        }));
    });

    it('should call contextualSearchSender with the right payload for url attribute', function() {
      const searchOptions = { url: true, pageKeywords: mockPageKeywords };

      helpCenter.contextualSearch(searchOptions);

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: mockPageKeywords
        }));
    });

    it('shouldn\'t call contextualSearchSender if no valid search options were passed', function() {
      let searchOptions = { foo: 'bar' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .not.toHaveBeenCalled();

      searchOptions = 5;

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .not.toHaveBeenCalled();

      searchOptions = false;

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .not.toHaveBeenCalled();

      searchOptions = 'foo bar';

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .not.toHaveBeenCalled();

      searchOptions = { labels: [] };

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .not.toHaveBeenCalled();

      searchOptions = { search: '' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .not.toHaveBeenCalled();
    });

    it('shouldn\'t call contextualSearchSender if url keywords are empty', function() {
      let searchOptions = { url: true, pageKeywords: '' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .not.toHaveBeenCalled();
    });

    it('shouldn\'t call updateResults if no results', function() {
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs.label_names)
        .toEqual(searchOptions.labels.join(','));

      expect(recentCallArgs.locale)
        .toBeFalsy();

      expect(recentCallArgs.origin)
        .toBeFalsy();

      mockContextualSearchSender.calls.mostRecent().args[1](responsePayloadNoResults);

      expect(helpCenter.updateResults)
        .not.toHaveBeenCalled();
    });

    it('should set states and call updateResults if results, with search', function() {
      const searchOptions = { search: 'foo bar' };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search,
          locale: undefined,
          origin: null
        }));

      mockContextualSearchSender.calls.mostRecent().args[1](responsePayloadResults);

      expect(helpCenter.updateResults)
        .toHaveBeenCalledWith(responsePayloadResults);

      expect(helpCenter.state)
        .toEqual(jasmine.objectContaining({
          isLoading: false,
          searchTerm: searchOptions.search,
          showIntroScreen: false,
          hasContextualSearched: true
        }));
    });

    it('should set states and call updateResults if results, with labels', function() {
      /* eslint camelcase:0 */
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          origin: null,
          locale: undefined,
          label_names: searchOptions.labels.join(',')
        }));

      mockContextualSearchSender.calls.mostRecent().args[1](responsePayloadResults);

      expect(helpCenter.updateResults)
        .toHaveBeenCalledWith(responsePayloadResults);

      expect(helpCenter.state)
        .toEqual(jasmine.objectContaining({
          isLoading: false,
          searchTerm: searchOptions.labels.join(','),
          showIntroScreen: false,
          hasContextualSearched: true
        }));
    });

    it('should request 3 results', function() {
      const searchOptions = { search: 'foo bar' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockContextualSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockContextualSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs.per_page)
        .toEqual(3);
    });

    it('should not call focusField', function() {
      const searchOptions = { search: 'foo bar' };
      const focusField = jasmine.createSpy('focusField');

      helpCenter.focusField = focusField;

      helpCenter.contextualSearch(searchOptions);

      mockContextualSearchSender.calls.mostRecent().args[1](responsePayloadResults);

      expect(focusField)
        .not.toHaveBeenCalled();
    });
  });

  describe('performSearch', function() {
    const responsePayloadError = {ok: false, body: {}};
    const responsePayloadResults = {ok: true, body: {results: [1, 2, 3], count: 3}};
    const responsePayloadNoResults = {ok: true, body: {results: [], count: 0}};

    let searchFail,
      helpCenter,
      mockOnSearch,
      mockSearchSender;

    beforeEach(function() {
      searchFail = jasmine.createSpy('searchFail');
      mockOnSearch = jasmine.createSpy('mockOnSearch');
      mockSearchSender = jasmine.createSpy('mockSearchSender');

      helpCenter = domRender(
        <HelpCenter
          onSearch={mockOnSearch}
          searchSender={mockSearchSender} />
      );
    });

    describe('searchFail', () => {
      beforeEach(() => {
        helpCenter.searchFail = searchFail;
      });

      it('should be called if the response status is not 200 OK', function() {
        helpCenter.performSearch({});

        expect(mockSearchSender)
          .toHaveBeenCalled();

        mockSearchSender.calls.mostRecent().args[1](responsePayloadError);

        expect(helpCenter.searchFail)
          .toHaveBeenCalled();
      });

      it('should be called when the searchSender failFn callback is fired', function() {
        helpCenter.performSearch({});

        expect(mockSearchSender)
          .toHaveBeenCalled();

        mockSearchSender.calls.mostRecent().args[2]();

        expect(helpCenter.searchFail)
          .toHaveBeenCalled();
      });
    });

    it('should call successFn if results returned', function() {
      const searchTerm = 'help me please';

      const query = { query: searchTerm, locale: 'en-US' };
      const successFn = jasmine.createSpy();

      helpCenter.performSearch(query, successFn);

      expect(mockSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockSearchSender.calls.mostRecent().args;

      expect(recentCallArgs[0])
        .toEqual(jasmine.objectContaining({
          query: searchTerm,
          locale: 'en-US'
        }));

      mockSearchSender.calls.mostRecent().args[1](responsePayloadResults);

      expect(successFn)
        .toHaveBeenCalled();
    });

    it('should retry search with no locale if query.locale is present localeFallback = true', () => {
      const query = {
        query: 'help me please',
        locale: 'es-ES'
      };

      mockSearchSender.calls.reset();

      helpCenter.performSearch(query, noop, { localeFallback: true });

      mockSearchSender.calls.mostRecent().args[1](responsePayloadNoResults);

      expect(mockSearchSender.calls.count())
        .toEqual(2);

      expect(mockSearchSender.calls.mostRecent().args[0].locale)
        .toBeUndefined();

      expect(mockSearchSender.calls.mostRecent().args[3])
        .toBeFalsy();
    });

    it('should set origin properly if manualSearch', function() {
      helpCenter.manualSearch({ preventDefault: noop });

      const recentCallArgs = mockSearchSender.calls.mostRecent().args;

      expect(recentCallArgs[0].origin)
        .toEqual('web_widget');
    });
  });

  describe('backtrack search', function() {
    it('should send the right request params when backtracking', function() {
      /* eslint camelcase:0 */
      const mockSearchSender = jasmine.createSpy('mockSearchSender');
      const helpCenter = domRender(
        <HelpCenter
          searchSender={mockSearchSender}
          trackSearch={trackSearch} />
      );
      const searchTerm = 'abcd';

      helpCenter.setState({
        searchTracked: false,
        searchTerm: searchTerm
      });

      helpCenter.backtrackSearch();

      expect(mockSearchSender)
        .toHaveBeenCalledWith({
          query: searchTerm,
          per_page: 0,
          origin: 'web_widget'
        });
    });

    it('should correctly backtrack if not done before and have searched', function() {
      const helpCenter = domRender(<HelpCenter trackSearch={trackSearch} />);

      helpCenter.setState({
        searchTracked: false,
        searchTerm: 'abcd'
      });

      helpCenter.trackSearch = trackSearch;

      helpCenter.backtrackSearch();

      expect(trackSearch)
        .toHaveBeenCalled();
    });

    it('shouldn\'t backtrack if already tracked', function() {
      const helpCenter = domRender(<HelpCenter trackSearch={trackSearch} />);

      helpCenter.setState({
        searchTracked: true,
        searchTerm: 'abcd'
      });

      helpCenter.trackSearch = trackSearch;

      helpCenter.backtrackSearch();

      expect(trackSearch)
        .not.toHaveBeenCalled();
    });

    it('shouldn\'t backtrack if no search has been performed', function() {
      const helpCenter = domRender(<HelpCenter trackSearch={trackSearch} />);

      helpCenter.setState({
        searchTracked: false,
        searchTerm: ''
      });

      helpCenter.trackSearch = trackSearch;

      helpCenter.backtrackSearch();

      expect(trackSearch)
        .not.toHaveBeenCalled();
    });
  });

  describe('interactiveSearchSuccessFn', () => {
    let mockOnSearch, helpCenter, result, query;

    beforeEach(() => {
      mockOnSearch = jasmine.createSpy('onSearch');
      helpCenter = domRender(<HelpCenter onSearch={mockOnSearch} />);

      result = {
        body: {
          results: []
        }
      };

      query = {
        query: 'a search query',
        locale: 'en-US'
      };

      helpCenter.updateResults = jasmine.createSpy('updateResults');
      helpCenter.focusField = jasmine.createSpy('focusField');

      helpCenter.interactiveSearchSuccessFn(result, query);
    });

    it('calls props.onSearch', () => {
      expect(mockOnSearch)
        .toHaveBeenCalled();

      expect(mockOnSearch.calls.mostRecent().args[0])
        .toEqual(jasmine.objectContaining({
          searchTerm: query.query,
          searchLocale: query.locale
        }));
    });

    it('calls updateResults', () => {
      expect(helpCenter.updateResults)
        .toHaveBeenCalled();

      expect(helpCenter.updateResults.calls.mostRecent().args[0])
        .toEqual(result);
    });

    it('calls focusField', () => {
      expect(helpCenter.focusField)
        .toHaveBeenCalled();
    });
  });

  it('searchStartState sets the correct values', () => {
    const helpCenter = domRender(<HelpCenter />);
    const result = helpCenter.searchStartState({});

    expect(result)
      .toEqual(jasmine.objectContaining({
        isLoading: true,
        searchResultClicked: false
      }));
  });

  it('searchCompleteState sets the correct values', () => {
    const helpCenter = domRender(<HelpCenter />);
    const result = helpCenter.searchCompleteState({});

    expect(result)
      .toEqual(jasmine.objectContaining({
        hasSearched: true,
        isLoading: false,
        searchFailed: false,
        searchResultClicked: false
      }));
  });

  describe('autoSearch', () => {
    it('should not call performSearch if the string is not valid', () => {
      const mockPerformSearch = jasmine.createSpy('mockPerformSearch');
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

      helpCenter.performSearch = mockPerformSearch;

      helpCenter.refs.searchField.getValue = () => '';
      helpCenter.autoSearch();

      expect(mockPerformSearch.calls.count())
        .toEqual(0);

      helpCenter.refs.searchField.getValue = () => '123 ';
      helpCenter.autoSearch();

      expect(mockPerformSearch)
        .not.toHaveBeenCalled();

      helpCenter.refs.searchField.getValue = () => 'validnotrailingspace';
      helpCenter.autoSearch();

      expect(mockPerformSearch)
        .not.toHaveBeenCalled();

      helpCenter.refs.searchField.getValue = () => 'validwithtrailingspace ';
      helpCenter.autoSearch();

      expect(mockPerformSearch.calls.count())
        .toEqual(1);
    });

    it('should not call performSearch if disableAutoSearch is true', () => {
      const mockPerformSearch = jasmine.createSpy('mockPerformSearch');
      const helpCenter = domRender(<HelpCenter searchSender={noop} disableAutoSearch={true} />);

      helpCenter.performSearch = mockPerformSearch;

      helpCenter.autoSearch();

      expect(mockPerformSearch)
        .not.toHaveBeenCalled();
    });

    it('should build up the query object correctly', () => {
      const searchTerm = 'a search term ';
      const mockPerformSearch = jasmine.createSpy('mockPerformSearch');
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

      helpCenter.performSearch = mockPerformSearch;

      helpCenter.refs.searchField.getValue = () => searchTerm;

      helpCenter.autoSearch();

      const recentCallArgs = mockPerformSearch.calls.mostRecent().args;

      expect(recentCallArgs[0])
        .toEqual(jasmine.objectContaining({
          query: searchTerm,
          per_page: 3,
          origin: null
        }));
    });

    it('should set the states correctly', () => {
      const searchTerm = 'a search term ';
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

      helpCenter.refs.searchField.getValue = () => searchTerm;

      helpCenter.autoSearch();

      expect(helpCenter.state)
        .toEqual(jasmine.objectContaining({
          isLoading: true,
          searchResultClicked: false,
          searchTerm: searchTerm,
          searchTracked: false
        }));
    });

    it('should call performSearch given a valid search string', () => {
      const mockPerformSearch = jasmine.createSpy('mockPerformSearch');
      const mockSearchSuccessFn = jasmine.createSpy('mockSearchSuccess');
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

      helpCenter.performSearch = mockPerformSearch;
      helpCenter.interactiveSearchSuccessFn = mockSearchSuccessFn;

      helpCenter.refs.searchField.getValue = () => 'valid ';

      mockPerformSearch.calls.reset();
      mockSearchSuccessFn.calls.reset();

      helpCenter.autoSearch();

      expect(mockPerformSearch.calls.count())
        .toEqual(1);

      mockPerformSearch.calls.mostRecent().args[1]();

      expect(mockSearchSuccessFn.calls.count())
        .toEqual(1);
    });
  });

  describe('manualSearch', () => {
    it('should not call performSearch if the string is empty', () => {
      const mockPerformSearch = jasmine.createSpy('mockPerformSearch');
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

      helpCenter.performSearch = mockPerformSearch;

      helpCenter.refs.searchField.getValue = () => '';

      helpCenter.manualSearch();

      expect(mockPerformSearch.calls.count())
        .toEqual(0);

      helpCenter.refs.searchField.getValue = () => 'valid';

      helpCenter.manualSearch();

      expect(mockPerformSearch.calls.count())
        .toEqual(1);
    });

    it('should build up the query object correctly', () => {
      const searchTerm = 'a search term';
      const mockPerformSearch = jasmine.createSpy('mockPerformSearch');
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

      helpCenter.performSearch = mockPerformSearch;

      helpCenter.refs.searchField.getValue = () => searchTerm;

      helpCenter.manualSearch();

      const recentCallArgs = mockPerformSearch.calls.mostRecent().args;

      expect(recentCallArgs[0])
        .toEqual(jasmine.objectContaining({
          query: searchTerm,
          per_page: 3,
          origin: 'web_widget'
        }));
    });

    it('should set the states correctly', () => {
      const searchTerm = 'a search term';
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

      helpCenter.refs.searchField.getValue = () => searchTerm;

      helpCenter.manualSearch();

      expect(helpCenter.state)
        .toEqual(jasmine.objectContaining({
          isLoading: true,
          searchResultClicked: false,
          searchTerm: searchTerm,
          searchTracked: true
        }));
    });

    it('should call performSearch given a valid search string', () => {
      const mockPerformSearch = jasmine.createSpy('mockPerformSearch');
      const mockSearchSuccessFn = jasmine.createSpy('mockSearchSuccess');
      const helpCenter = domRender(<HelpCenter searchSender={noop} />);

      helpCenter.performSearch = mockPerformSearch;
      helpCenter.interactiveSearchSuccessFn = mockSearchSuccessFn;

      helpCenter.refs.searchField.getValue = () => 'valid';

      mockPerformSearch.calls.reset();
      mockSearchSuccessFn.calls.reset();

      helpCenter.manualSearch();

      expect(mockPerformSearch.calls.count())
        .toEqual(1);

      mockPerformSearch.calls.mostRecent().args[1]();

      expect(mockSearchSuccessFn.calls.count())
        .toEqual(1);
    });

    it('should track view and render the inline article', function() {
      /* eslint camelcase:0 */
      // TODO: Ported over from old performSearch test to catch regression
      // Needs to be rewritten
      const mockSearchSender = jasmine.createSpy('mockSearchSender');
      const mockOnArticleClick = jasmine.createSpy('mockOnArticleClick');
      const helpCenter = domRender(
        <HelpCenter
          searchSender={mockSearchSender}
          onArticleClick={mockOnArticleClick}
          onSearch={noop}
          onLinkClick={noop}
          showBackButton={noop} />
      );
      const searchTerm = 'help, I\'ve fallen and can\'t get up!';
      const responseArticle = {
        id: 0,
        title: 'bob',
        name: 'bob',
        html_url: 'bob.com'
      };
      const responsePayload = {
        body: {
          results: [responseArticle, responseArticle, responseArticle],
          count: 3
        },
        ok: true
      };
      const article = ReactDOM.findDOMNode(
        TestUtils.findRenderedDOMComponentWithClass(helpCenter, 'UserContent')
      ).parentNode;

      helpCenter.trackSearch = trackSearch;

      helpCenter.refs.searchField.getValue = () => searchTerm;

      helpCenter.performSearch({query: searchTerm}, helpCenter.interactiveSearchSuccessFn);

      // THIS setState BLOCK TO SIMULATE manualSearch triggering performSearch
      // TODO: make a better version of this test case
      helpCenter.setState({
        searchTerm: searchTerm,
        searchTracked: true
      });

      mockSearchSender.calls.mostRecent().args[1](responsePayload);

      expect(article.className)
        .toMatch('u-isHidden');

      helpCenter.handleArticleClick(1, { preventDefault: noop });

      jasmine.clock().tick(1);

      expect(trackSearch)
        .not.toHaveBeenCalled();

      expect(mockOnArticleClick)
        .toHaveBeenCalledWith({
          query: searchTerm,
          resultsCount: 3,
          uniqueSearchResultClick: true,
          articleId: 0,
          locale: undefined
        });

      expect(article.className)
        .not.toMatch('u-isHidden');
    });
  });

  describe('results', () => {
    let helpCenter,
      results;

    beforeEach(() => {
      helpCenter = domRender(<HelpCenter />);
    });

    it('renders HelpCenterResults when state.hasSearched is true', () => {
      helpCenter.setState({ hasSearched: true });

      jasmine.clock().tick(1);

      results = ReactDOM.findDOMNode(
        TestUtils.findRenderedDOMComponentWithClass(helpCenter, 'HelpCenterResults')
      ).parentNode;

      expect(results)
        .toBeTruthy();
    });

    it('renders HelpCenterResults when state.hasContextualSearched is true', () => {
      helpCenter.setState({ hasContextualSearched: true });

      results = ReactDOM.findDOMNode(
        TestUtils.findRenderedDOMComponentWithClass(helpCenter, 'HelpCenterResults')
      ).parentNode;

      expect(results)
        .toBeTruthy();
    });
  });

  describe('handleViewMoreClick', () => {
    let helpCenter;

    beforeEach(() => {
      helpCenter = domRender(<HelpCenter searchSender={noop}/>);
      helpCenter.manualSearch = manualSearch;
    });

    it('sets state.resultsPerPage to 9', () => {
      expect(helpCenter.state.resultsPerPage)
        .toEqual(3);

      helpCenter.handleViewMoreClick({ preventDefault: noop });

      expect(helpCenter.state.resultsPerPage)
        .toEqual(9);
    });

    it('sets state.viewMoreActive to true', () => {
      expect(helpCenter.state.viewMoreActive)
        .toEqual(false);

      helpCenter.handleViewMoreClick({ preventDefault: noop });

      expect(helpCenter.state.viewMoreActive)
        .toEqual(true);
    });

    it('calls manualSearch', () => {
      helpCenter.handleViewMoreClick({ preventDefault: noop });

      jasmine.clock().tick(1);

      expect(helpCenter.manualSearch)
        .toHaveBeenCalled();
    });
  });
});
