describe('Help center component', function() {
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
      'react/addons': React,
      'service/beacon': {
        beacon: jasmine.createSpyObj('beacon', ['track'])
      },
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['send'])
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
          }),
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
          }),
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
      'mixin/searchFilter': {
        stopWordsFilter: function(str) {
          return str;
        }
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
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly set the initial states when created', function() {
    const helpCenter = React.render(
      <HelpCenter />,
      global.document.body
    );

    expect(helpCenter.state.articles)
      .toEqual([]);
  });

  it('should set the button label based on the defaultButtonLabel property', function() {
    React.render(
      <HelpCenter buttonLabelKey='contact' />,
      global.document.body
    );

    expect(document.querySelector('a.u-userTextColor').textContent)
      .toEqual('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact');
  });

  it('should call i18n.t with the right parameter to set the label', function() {
    const labelKey = 'foo bar';

    spyOn(mockRegistry['service/i18n'].i18n, 't').and.callThrough();

    React.render(
      <HelpCenter buttonLabelKey={labelKey} />,
      global.document.body
    );

    /* jshint maxlen:false */
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
        mockTransport;

    beforeEach(function() {
      mockTransport = mockRegistry['service/transport'].transport;

      helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );
    });

    it('should set the right payload for search attribute', function() {
      const searchOptions = { search: 'foo bar' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      expect(recentCallArgs.query.query)
        .toEqual(searchOptions.search);

      /* jshint camelcase: false */
      expect(recentCallArgs.query.label_names)
        .toBeFalsy();
    });

    it('should set the right payload for labels attribute', function() {
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase: false */
      expect(recentCallArgs.query)
        .toEqual(jasmine.objectContaining({
          query: undefined,
          label_names: searchOptions.labels.join(',')
        }));
    });

    it('should set the right payload for search and labels attribute', function() {
      const searchOptions = {
        search: 'my search',
        labels: ['foo', 'bar']
      };

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase: false */
      expect(recentCallArgs.query)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search,
          label_names: undefined
        }));
    });

    it('shouldn\'t call transport.send if no valid search options were passed', function() {
      let searchOptions = { foo: 'bar' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .not.toHaveBeenCalled();

      searchOptions = 5;

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .not.toHaveBeenCalled();

      searchOptions = false;

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .not.toHaveBeenCalled();

      searchOptions = 'foo bar';

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .not.toHaveBeenCalled();

      searchOptions = { labels: [] };

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .not.toHaveBeenCalled();

      searchOptions = { search: '' };

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .not.toHaveBeenCalled();
    });

    it('shouldn\'t call updateResults if no results', function() {
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase: false */
      expect(recentCallArgs.query.label_names)
        .toEqual(searchOptions.labels.join(','));

      expect(recentCallArgs.query.locale)
        .toBeFalsy();

      expect(recentCallArgs.query.origin)
        .toBeFalsy();

      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayloadNoResults);

      expect(helpCenter.updateResults)
        .not.toHaveBeenCalled();
    });

    it('should set states and call updateResults if results, with search', function() {
      const searchOptions = { search: 'foo bar' };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase: false */
      expect(recentCallArgs.query)
        .toEqual(jasmine.objectContaining({
          query: searchOptions.search,
          origin: null,
          locale: undefined,
          label_names: undefined
        }));

      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayloadResults);

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
      const searchOptions = { labels: ['foo', 'bar'] };

      helpCenter.updateResults = updateResults;

      helpCenter.contextualSearch(searchOptions);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase: false */
      expect(recentCallArgs.query)
        .toEqual(jasmine.objectContaining({
          query: undefined,
          origin: null,
          locale: undefined,
          label_names: searchOptions.labels.join(',')
        }));

      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayloadResults);

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

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase:false */
      expect(recentCallArgs.query.per_page)
        .toEqual(3);
    });
  });

  describe('performSearch', function() {
    const responsePayloadError = {ok: false, body: {}};
    const responsePayloadResults = {ok: true, body: {results: [1, 2, 3], count: 3}};
    const responsePayloadNoResults = {ok: true, body: {results: [], count: 0}};

    let searchFail,
        helpCenter,
        mockOnSearch,
        mockTransport;

    beforeEach(function() {
      searchFail = jasmine.createSpy('searchFail');
      mockOnSearch = jasmine.createSpy('mockOnSearch');
      mockTransport = mockRegistry['service/transport'].transport;

      helpCenter = React.render(
        <HelpCenter onSearch={mockOnSearch} />,
        global.document.body
      );
    });

    it('should call searchFail if the result object is not OK', function() {
      helpCenter.searchFail = searchFail;

      helpCenter.performSearch('help me please');

      expect(mockTransport.send)
        .toHaveBeenCalled();

      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayloadError);

      expect(helpCenter.searchFail)
        .toHaveBeenCalled();
    });

    it('should call searchFail if the search fail callback is fired', function() {
      helpCenter.searchFail = searchFail;

      helpCenter.performSearch('help me please');

      expect(mockTransport.send)
        .toHaveBeenCalled();

      mockTransport.send.calls.mostRecent().args[0].callbacks.fail();

      expect(helpCenter.searchFail)
        .toHaveBeenCalled();
    });

    it('should call updateResults if no locale', function() {
      const searchString = 'help me please';

      helpCenter.updateResults = updateResults;

      helpCenter.performSearch(searchString);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase: false */
      expect(recentCallArgs.query)
        .toEqual(jasmine.objectContaining({
          query: searchString,
          origin: null,
          locale: undefined,
          label_names: undefined
        }));

      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayloadNoResults);

      expect(helpCenter.updateResults)
        .toHaveBeenCalledWith(responsePayloadNoResults);
    });

    it('should call updateResults if results returned', function() {
      const searchString = 'help me please';

      helpCenter.updateResults = updateResults;

      helpCenter.performSearch(searchString);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase: false */
      expect(recentCallArgs.query)
        .toEqual(jasmine.objectContaining({
          query: searchString,
          origin: null,
          locale: undefined,
          label_names: undefined
        }));

      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayloadResults);

      expect(helpCenter.updateResults)
        .toHaveBeenCalledWith(responsePayloadResults);
    });

    it('should re-search without locale if with locale and no results', function() {
      const searchString = 'help me please';
      const searchLocale = 'es-ES';

      mockRegistry['service/i18n'].i18n.getLocale = function() {
        return searchLocale;
      };

      mockery.resetCache();

      helpCenter.updateResults = updateResults;

      helpCenter.performSearch(searchString);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase: false */
      expect(recentCallArgs.query)
        .toEqual(jasmine.objectContaining({
          query: searchString,
          origin: null,
          locale: searchLocale,
          label_names: undefined
        }));

      mockTransport.send.calls.mostRecent().args[0].callbacks.done(
        responsePayloadNoResults,
        searchLocale
      );

      recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase: false */
      expect(recentCallArgs.query)
        .toEqual(jasmine.objectContaining({
          query: searchString,
          origin: null,
          locale: undefined,
          label_names: undefined
        }));
    });

    it('should set origin properly if forceSearch', function() {
      const searchString = 'help me please';
      const forceSearch = true;

      helpCenter.updateResults = updateResults;

      helpCenter.performSearch(searchString, forceSearch);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase: false */
      expect(recentCallArgs.query)
        .toEqual(jasmine.objectContaining({
          query: searchString,
          origin: 'web_widget',
          locale: undefined,
          label_names: undefined
        }));
    });

    it('should request 3 articles', function() {
      const searchString = 'help me please';

      helpCenter.performSearch(searchString);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      let recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      /* jshint camelcase:false */
      expect(recentCallArgs.query.per_page)
        .toEqual(3);
    });
  });

  describe('backtrack search', function() {
    it('should send the right request params when backtracking', function() {
      const helpCenter = React.render(
        <HelpCenter trackSearch={trackSearch} />,
        global.document.body
      );
      const mockTransport = mockRegistry['service/transport'].transport;
      const searchTerm = 'abcd';

      helpCenter.setState({
        searchTracked: false,
        searchTerm: searchTerm
      });

      helpCenter.backtrackSearch();

      expect(mockTransport.send)
        .toHaveBeenCalledWith({
          method: 'get',
          path: '/api/v2/help_center/search.json',
          /* jshint camelcase:false */
          query: {
            query: searchTerm,
            per_page: 0,
            origin: 'web_widget'
          }
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

  describe('handle change', function() {

    it('should fire off call to search api when handleSubmit is called', function() {
      const mockOnSearch = jasmine.createSpy('mockOnSearch');
      const helpCenter = React.render(
        <HelpCenter onSearch={mockOnSearch} />,
        global.document.body
      );
      const mockTransport = mockRegistry['service/transport'].transport;
      const responsePayload = {ok: true, body: {results: [1, 2, 3], count: 3}};

      helpCenter.handleSubmit({preventDefault: noop});

      expect(helpCenter.state.hasSearched)
        .toBeFalsy();

      expect(helpCenter.state.isLoading)
        .toBeTruthy();

      expect(helpCenter.state.searchTerm)
        .toEqual('Foobar');

      expect(mockTransport.send)
        .toHaveBeenCalled();

      expect(searchFieldGetValue)
        .toHaveBeenCalled();

      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayload);

      expect(helpCenter.state.isLoading)
        .toBeFalsy();

      expect(helpCenter.state.hasSearched)
        .toBeTruthy();

      expect(mockOnSearch).toHaveBeenCalled();
    });

    it('should render list of results from api', function() {
      const helpCenter = React.render(
        <HelpCenter onSearch={noop} />,
        global.document.body
      );
      const mockTransport = mockRegistry['service/transport'].transport;
      const searchString = 'help, I\'ve fallen and can\'t get up!';
      const responsePayload = {body: {results: [1, 2, 3], count: 4}, ok: true};
      const listAnchor = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'List');

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayload);

      expect(listAnchor.props.className)
        .not.toContain('u-isHidden');
    });

    it('should track view and render the inline article', function() {
      const helpCenter = React.render(
        <HelpCenter
          onSearch={noop}
          onLinkClick={noop}
          showBackButton={noop} />,
        global.document.body
      );
      const mockTransport = mockRegistry['service/transport'].transport;
      const mockBeacon = mockRegistry['service/beacon'].beacon;
      const searchString = 'help, I\'ve fallen and can\'t get up!';
      const responseArticle = {
        /* jshint camelcase: false */
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
      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayload);

      const listItem = ReactTestUtils
        .scryRenderedDOMComponentsWithClass(helpCenter, 'List-item')[0];
      const listAnchor = ReactTestUtils
        .findRenderedDOMComponentWithTag(listItem, 'a');

      expect(article.className)
        .toMatch('u-isHidden');

      ReactTestUtils.Simulate.click(listAnchor, {
        target: { getAttribute: function() { return 0; }
      }});

      expect(trackSearch)
        .not.toHaveBeenCalled();

      expect(mockBeacon.track)
        .toHaveBeenCalledWith(
          'helpCenter',
          'click',
          'helpCenterForm', {
            query: 'Foobar',
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
      const helpCenter = React.render(
        <HelpCenter onSearch={noop} />,
        global.document.body
      );
      const mockTransport = mockRegistry['service/transport'].transport;
      const searchString = 'help, I\'ve fallen and can\'t get up!';
      const responsePayload = {ok: false};
      const list = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'List');

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayload);

      expect(list.props.className).
        toContain('u-isHidden');

      expect(helpCenter.getDOMNode().querySelector('#noResults').className)
        .not.toContain('u-isHidden');
    });

    it('should show no results when search returns no results', function() {
      const helpCenter = React.render(
        <HelpCenter onSearch={noop} />,
        global.document.body
      );
      const mockTransport = mockRegistry['service/transport'].transport;
      const searchString = 'abcd';
      const responsePayload = {body: {results: [], count: 0}};
      const list = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'List');

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayload);

      expect(helpCenter.state.searchCount)
        .toBeFalsy();

      expect(list.props.className)
        .toContain('u-isHidden');
    });

    it('shouldn\'t call handle search if the string isn\'t valid', function() {
      const helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );
      const mockTransport = mockRegistry['service/transport'].transport;
      const returnSearchTerm = function(term) { return term; };
      const searchStringTooShort = 'hi! ';
      const searchStringNoSpace = 'help, I\'ve fallen and can\'t get up!';
      let mockGetValue = helpCenter.refs.searchField.getValue;

      mockGetValue = returnSearchTerm.bind(this, searchStringTooShort);
      helpCenter.handleSearch();

      mockGetValue = returnSearchTerm.bind(this, searchStringNoSpace);
      helpCenter.handleSearch();

      expect(mockTransport.send.calls.count())
        .toEqual(0);
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

    it('sets focus state on searchField when search is made on desktop', function() {
      const helpCenter = React.render(
        <HelpCenter onSearch={noop} />,
        global.document.body
      );
      const mockTransport = mockRegistry['service/transport'].transport;
      const searchString = 'help, I\'ve fallen and can\'t get up!';
      const responsePayload = {body: {results: [1], count: 1}, ok: true};

      expect(helpCenter.refs.searchField.state)
        .toBeFalsy();

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayload);

      expect(helpCenter.refs.searchField.state.focused)
        .toEqual(true);
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
