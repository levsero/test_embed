describe('Help center component', function() {
  var HelpCenter,
      mockRegistry,
      trackSearch;
  const searchFieldBlur = jasmine.createSpy();
  const searchFieldGetValue = jasmine.createSpy().and.returnValue('Foobar');
  const helpCenterPath = buildSrcPath('component/HelpCenter');

  beforeEach(function() {

    trackSearch = jasmine.createSpy('trackSearch');

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
              return (<form onSubmit={this.handleSubmit}>
                {this.props.children}
              </form>);
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
            blur: searchFieldBlur,
            getValue: searchFieldGetValue,
            render: function() {
              return (
                <input ref='searchField' type='search' />
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
      'component/Button': {
        Button: React.createClass({
            render: function() {
              return <input className='Button' type='button' />;
            }
          })
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'init',
          'setLocale',
          'getLocale',
          't',
          'isRTL'
        ])
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

  describe('backtrack search', function() {
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

      var helpCenter = React.render(
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

      var helpCenter = React.render(
        <HelpCenter />,
        global.document.body
      );

      expect(helpCenter.state.fullscreen)
        .toEqual(false);
    });
  });
});
