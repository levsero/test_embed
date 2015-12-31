describe('HelpCenter component', function() {
  let HelpCenter,
    mockRegistry,
    trackSearch,
    updateResults;
  const searchFieldBlur = jasmine.createSpy();
  const searchFieldGetValue = jasmine.createSpy().and.returnValue('Foobar');
  const helpCenterPath = buildSrcPath('component/HelpCenter');

  beforeEach(function() {
    trackSearch = jasmine.createSpy('trackSearch');
    updateResults = jasmine.createSpy('updateResults');

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'React': React,
      'service/beacon': {
        beacon: jasmine.createSpyObj('beacon', ['track'])
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'component/HelpCenterForm': {
        HelpCenterForm: React.createClass({
          render: function() {
            return (
              <form onSubmit={this.handleSubmit}>
                {this.props.children}
              </form>
            );
          }
        })
      },
      'component/HelpCenterArticle': {
        HelpCenterArticle: React.createClass({
          render: function() {
            return <div className='UserContent' />;
          }
        })
      },
      'component/FormField': {
        SearchField: React.createClass({
          focus: function() {
            this.setState({
              focused: true
            });
          },
          blur: searchFieldBlur,
          getValue: searchFieldGetValue,
          render: function() {
            return (
              <div ref='searchField' type='search'>
                <input ref='searchFieldInput' value='' type='search' />
              </div>
            );
          }
        }),
        SearchFieldButton: React.createClass({
          render: function() {
            return (
              <input
                ref='searchFieldButton'
                type='search'
                onClick={this.props.onClick} />
            );
          }
        })
      },
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      },
      'component/Container': {
        Container: React.createClass({
          render: function() {
            return <div>{this.props.children}</div>;
          }
        })
      },
      'component/ScrollContainer': {
        ScrollContainer: React.createClass({
          setScrollShadowVisible: noop,
          render: function() {
            return (
              <div>
                {this.props.headerContent}
                {this.props.children}
                {this.props.footerContent}
              </div>
            );
          }
        })
      },
      'component/Button': {
        Button: React.createClass({
          render: function() {
            return <input className='Button' type='button' />;
          }
        }),
        ButtonGroup: noopReactComponent()
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
      'service/persistence': {
        store: jasmine.createSpyObj('store', ['set', 'get'])
      },
      'utility/devices': {
        getSizingRatio: function() {
          return 1;
        },
        isMobileBrowser: function() {
          return false;
        }
      },
      '_': _
    });

    mockery.registerAllowable(helpCenterPath);

    HelpCenter = require(helpCenterPath).HelpCenter;

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
      helpCenter = React.render(
        <HelpCenter
          buttonLabelKey='contact' />,
        global.document.body
      );
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

    React.render(
      <HelpCenter buttonLabelKey={labelKey} />,
      global.document.body
    );

    expect(mockRegistry['service/i18n'].i18n.t)
      .toHaveBeenCalledWith(`embeddable_framework.helpCenter.submitButton.label.submitTicket.${labelKey}`);
  });

  describe('updateResults', function() {
    let helpCenter;

    beforeEach(function() {
      helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );
    });

    it('should set states matching the response with results', function() {
      const responsePayloadResults = {ok: true, body: {results: [1, 2, 3], count: 3}};

      helpCenter.updateResults(responsePayloadResults);

      expect(helpCenter.state.articles)
        .toEqual(responsePayloadResults.body.results);

      expect(helpCenter.state.resultsCount)
        .toEqual(responsePayloadResults.body.count);
    });

    it('should set states matching the response without results', function() {
      const responsePayloadNoResults = {ok: true, body: {results: [], count: 0}};

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
      const helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );

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
      mockSearchSender;

    beforeEach(function() {
      mockSearchSender = jasmine.createSpy('mockSearchSender');

      helpCenter = React.render(
        <HelpCenter searchSender={mockSearchSender}/>,
        global.document.body
      );
    });

    it('should call searchSender with the right payload for search attribute', function() {
      const searchOptions = { search: 'foo bar' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs.query)
        .toEqual(searchOptions.search);

      expect(recentCallArgs.label_names)
        .toBeFalsy();
    });

    it('should call searchSender with the right payload for labels attribute', function() {
      /* eslint camelcase:0 */
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          label_names: searchOptions.labels.join(',')
        }));
    });

    it('should call searchSender with the right payload for search and labels attribute', function() {
      const searchOptions = {
        search: 'my search',
        labels: ['foo', 'bar']
      };

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search
        }));
    });

    it('shouldn\'t call searchSender if no valid search options were passed', function() {
      let searchOptions = { foo: 'bar' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .not.toHaveBeenCalled();

      searchOptions = 5;

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .not.toHaveBeenCalled();

      searchOptions = false;

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .not.toHaveBeenCalled();

      searchOptions = 'foo bar';

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .not.toHaveBeenCalled();

      searchOptions = { labels: [] };

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .not.toHaveBeenCalled();

      searchOptions = { search: '' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .not.toHaveBeenCalled();
    });

    it('shouldn\'t call updateResults if no results', function() {
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs.label_names)
        .toEqual(searchOptions.labels.join(','));

      expect(recentCallArgs.locale)
        .toBeFalsy();

      expect(recentCallArgs.origin)
        .toBeFalsy();

      mockSearchSender.calls.mostRecent().args[1](responsePayloadNoResults);

      expect(helpCenter.updateResults)
        .not.toHaveBeenCalled();
    });

    it('should set states and call updateResults if results, with search', function() {
      const searchOptions = { search: 'foo bar' };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search,
          locale: undefined,
          origin: null
        }));

      mockSearchSender.calls.mostRecent().args[1](responsePayloadResults);

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

      expect(mockSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs)
        .toEqual(jasmine.objectContaining({
          origin: null,
          locale: undefined,
          label_names: searchOptions.labels.join(',')
        }));

      mockSearchSender.calls.mostRecent().args[1](responsePayloadResults);

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

      expect(mockSearchSender)
        .toHaveBeenCalled();

      const recentCallArgs = mockSearchSender.calls.mostRecent().args[0];

      expect(recentCallArgs.per_page)
        .toEqual(3);
    });

    it('should not call focusField', function() {
      const searchOptions = { search: 'foo bar' };
      const focusField = jasmine.createSpy('focusField');

      helpCenter.focusField = focusField;

      helpCenter.contextualSearch(searchOptions);

      mockSearchSender.calls.mostRecent().args[1](responsePayloadResults);

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

      helpCenter = React.render(
        <HelpCenter
          onSearch={mockOnSearch}
          searchSender={mockSearchSender} />,
        global.document.body
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

      helpCenter.performSearch(query, () => {}, true);

      mockSearchSender.calls.mostRecent().args[1](responsePayloadNoResults);

      expect(mockSearchSender.calls.count())
        .toEqual(2);

      expect(mockSearchSender.calls.mostRecent().args[0].locale)
        .toBeUndefined();

      expect(mockSearchSender.calls.mostRecent().args[3])
        .toBeFalsy();
    });

    it('should set origin properly if manualSearch', function() {
      helpCenter.manualSearch();

      const recentCallArgs = mockSearchSender.calls.mostRecent().args;

      expect(recentCallArgs[0].origin)
        .toEqual('web_widget');
    });
  });

  describe('backtrack search', function() {
    it('should send the right request params when backtracking', function() {
      /* eslint camelcase:0 */
      const mockSearchSender = jasmine.createSpy('mockSearchSender');
      const helpCenter = React.render(
        <HelpCenter
          searchSender={mockSearchSender}
          trackSearch={trackSearch} />,
        global.document.body
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
      const helpCenter = React.render(
        <HelpCenter trackSearch={trackSearch} />,
        global.document.body
      );

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
      const helpCenter = React.render(
        <HelpCenter trackSearch={trackSearch} />,
        global.document.body
      );

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
      const helpCenter = React.render(
        <HelpCenter trackSearch={trackSearch} />,
        global.document.body
      );

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
      helpCenter = React.render(
        <HelpCenter
          onSearch={mockOnSearch} />,
        global.document.body
      );

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
    const helpCenter = React.render(
      <HelpCenter />,
      global.document.body
    );
    const result = helpCenter.searchStartState({});

    expect(result)
      .toEqual(jasmine.objectContaining({
        isLoading: true,
        searchResultClicked: false
      }));
  });

  it('searchCompleteState sets the correct values', () => {
    const helpCenter = React.render(
      <HelpCenter />,
      global.document.body
    );
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
      const helpCenter = React.render(
        <HelpCenter searchSender={() => {}} />,
        global.document.body
      );

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

    it('should build up the query object correctly', () => {
      const searchTerm = 'a search term ';
      const mockPerformSearch = jasmine.createSpy('mockPerformSearch');
      const helpCenter = React.render(
        <HelpCenter searchSender={() => {}} />,
        global.document.body
      );

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
      const helpCenter = React.render(
        <HelpCenter searchSender={() => {}} />,
        global.document.body
      );

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
      const helpCenter = React.render(
        <HelpCenter searchSender={() => {}} />,
        global.document.body
      );

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
      const helpCenter = React.render(
        <HelpCenter searchSender={() => {}} />,
        global.document.body
      );

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
      const helpCenter = React.render(
        <HelpCenter searchSender={() => {}} />,
        global.document.body
      );

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
      const helpCenter = React.render(
        <HelpCenter searchSender={() => {}} />,
        global.document.body
      );

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
      const helpCenter = React.render(
        <HelpCenter searchSender={() => {}} />,
        global.document.body
      );

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

    it('should render list of results from api', function() {
      // TODO: Ported over from old performSearch test to catch regression
      // Needs to be rewritten

      const mockSearchSender = jasmine.createSpy('mockSearchSender');
      const mockOnSearch = jasmine.createSpy('mockOnSearch');
      const helpCenter = React.render(
        <HelpCenter
          searchSender={mockSearchSender}
          onSearch={mockOnSearch} />,
        global.document.body
      );
      const searchTerm = 'help, I\'ve fallen and can\'t get up!';
      const responsePayload = {body: {results: [1, 2, 3], count: 4}, ok: true};
      const listAnchor = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'List');

      helpCenter.refs.searchField.getValue = () => searchTerm;
      helpCenter.performSearch({query: searchTerm}, helpCenter.interactiveSearchSuccessFn);

      mockSearchSender.calls.mostRecent().args[1](responsePayload);

      expect(listAnchor.props.className)
        .not.toContain('u-isHidden');
    });

    it('should track view and render the inline article', function() {
      /* eslint camelcase:0 */
      // TODO: Ported over from old performSearch test to catch regression
      // Needs to be rewritten

      const mockSearchSender = jasmine.createSpy('mockSearchSender');
      const helpCenter = React.render(
        <HelpCenter
          searchSender={mockSearchSender}
          onSearch={noop}
          onLinkClick={noop}
          showBackButton={noop} />,
        global.document.body
      );
      const mockBeacon = mockRegistry['service/beacon'].beacon;
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
      const article = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'UserContent')
        .getDOMNode()
        .parentNode;

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

      const listItem = ReactTestUtils
        .scryRenderedDOMComponentsWithClass(helpCenter, 'List-item')[0];
      const listAnchor = ReactTestUtils
        .findRenderedDOMComponentWithTag(listItem, 'a');

      expect(article.className)
        .toMatch('u-isHidden');

      ReactTestUtils.Simulate.click(listAnchor, {
        target: { getAttribute: function() { return 0; }
      }});

      jasmine.clock().tick(1);

      expect(trackSearch)
        .not.toHaveBeenCalled();

      expect(mockBeacon.track)
        .toHaveBeenCalledWith(
          'helpCenter',
          'click',
          'helpCenterForm', {
            query: searchTerm,
            resultsCount: 3,
            uniqueSearchResultClick: true,
            articleId: 0,
            locale: undefined
          }
        );

      expect(article.className)
        .not.toMatch('u-isHidden');
    });

    it('should render error message when search fails', function() {
      // TODO: Ported over from old performSearch test to catch regression
      // Needs to be rewritten

      const mockSearchSender = jasmine.createSpy('mockSearchSender');
      const helpCenter = React.render(
        <HelpCenter
          searchSender={mockSearchSender}
          onSearch={noop} />,
        global.document.body
      );
      const searchTerm = 'help, I\'ve fallen and can\'t get up!';
      const responsePayload = {ok: false};
      const list = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'List');

      helpCenter.refs.searchField.getValue = () => searchTerm;
      helpCenter.performSearch({query: searchTerm}, helpCenter.interactiveSearchSuccessFn);

      mockSearchSender.calls.mostRecent().args[1](responsePayload);

      expect(list.props.className).
        toContain('u-isHidden');

      expect(helpCenter.getDOMNode().querySelector('#noResults').className)
        .not.toContain('u-isHidden');
    });

    it('should show no results when search returns no results', function() {
      // TODO: Ported over from old performSearch test to catch regression
      // Needs to be rewritten

      const mockSearchSender = jasmine.createSpy('mockSearchSender');
      const helpCenter = React.render(
        <HelpCenter
          searchSender={mockSearchSender}
          onSearch={noop} />,
        global.document.body
      );
      const searchTerm = 'abcd';
      const responsePayload = {body: {results: [], count: 0}};
      const list = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'List');

      helpCenter.refs.searchField.getValue = () => searchTerm;
      helpCenter.performSearch({query: searchTerm}, helpCenter.interactiveSearchSuccessFn);

      mockSearchSender.calls.mostRecent().args[1](responsePayload);

      expect(helpCenter.state.searchCount)
        .toBeFalsy();

      expect(list.props.className)
        .toContain('u-isHidden');
    });
  });

  describe('fullscreen state', function() {
    it('should be true if isMobileBrowser() is true', function() {

      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return true;
      };

      mockery.resetCache();
      HelpCenter = require(helpCenterPath).HelpCenter;

      const helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );

      expect(helpCenter.state.fullscreen)
        .toEqual(true);
    });

    it('should be false if isMobileBrowser() is false', function() {

      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return false;
      };

      mockery.resetCache();
      HelpCenter = require(helpCenterPath).HelpCenter;

      const helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );

      expect(helpCenter.state.fullscreen)
        .toEqual(false);
    });
  });

  it('should not display noResults message for unsatisfied conditions', function() {
    // if any is not satisfied
    // if showIntroScreen is false &&
    // resultsCount is 0 &&
    // hasSearched is true

    mockRegistry['utility/devices'].isMobileBrowser = function() {
      return true;
    };

    mockery.resetCache();
    HelpCenter = require(helpCenterPath).HelpCenter;

    const helpCenter = React.render(
      <HelpCenter />,
      global.document.body
    );

    ReactTestUtils.Simulate.click(helpCenter.refs.searchFieldButton.getDOMNode());

    expect(helpCenter.state.showIntroScreen)
      .toEqual(false);

    expect(helpCenter.state.resultsCount)
      .toEqual(0);

    expect(helpCenter.state.hasSearched)
      .toEqual(false);

    expect(helpCenter.getDOMNode().querySelector('#noResults'))
      .toBeFalsy();
  });

  it('should display noResults message for satisfied conditions', function() {
    // if showIntroScreen is false &&
    // resultsCount is 0 &&
    // hasSearched is true

    mockRegistry['utility/devices'].isMobileBrowser = function() {
      return true;
    };

    mockery.resetCache();
    HelpCenter = require(helpCenterPath).HelpCenter;

    const helpCenter = React.render(
      <HelpCenter />,
      global.document.body
    );

    ReactTestUtils.Simulate.click(helpCenter.refs.searchFieldButton.getDOMNode());

    helpCenter.setState({ hasSearched: true });

    expect(helpCenter.state.hasSearched)
      .toEqual(true);

    expect(helpCenter.getDOMNode().querySelector('#noResults'))
      .toBeTruthy();
  });

  describe('searchField', function() {
    it('should render component if fullscreen is false', function() {
      const helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );

      expect(helpCenter.refs.searchField)
        .toBeTruthy();

      expect(helpCenter.refs.searchFieldButton)
        .toBeFalsy();
    });
  });

  describe('searchFieldButton', function() {
    it('should render component if fullscreen is true', function() {

      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return true;
      };

      mockery.resetCache();
      HelpCenter = require(helpCenterPath).HelpCenter;

      const helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );

      expect(helpCenter.refs.searchFieldButton)
        .toBeTruthy();

      expect(helpCenter.refs.searchField)
        .toBeFalsy();
    });

    it('sets `showIntroScreen` state to false when component is clicked', function() {

      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return true;
      };

      mockery.resetCache();
      HelpCenter = require(helpCenterPath).HelpCenter;

      const helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );

      expect(helpCenter.state.showIntroScreen)
        .toBe(true);
      ReactTestUtils.Simulate.click(helpCenter.refs.searchFieldButton.getDOMNode());

      expect(helpCenter.state.showIntroScreen)
        .toBe(false);
    });

    it('sets focus state on searchField when component is clicked on mobile', function() {

      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return true;
      };

      mockery.resetCache();
      HelpCenter = require(helpCenterPath).HelpCenter;

      const helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );

      expect(helpCenter.refs.searchField)
        .toBeFalsy();
      ReactTestUtils.Simulate.click(helpCenter.refs.searchFieldButton.getDOMNode());

      const searchField = helpCenter.refs.searchField;

      expect(searchField.state.focused)
        .toEqual(true);
    });
  });
});
