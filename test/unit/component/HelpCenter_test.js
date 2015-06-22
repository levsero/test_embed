describe('Help center component', function() {
  var HelpCenter,
      mockRegistry,
      searchFieldBlur = jasmine.createSpy(),
      searchFieldGetValue = jasmine.createSpy().and.returnValue('Foobar'),
      helpCenterPath = buildSrcPath('component/HelpCenter');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
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
        ZendeskLogo: React.createClass({
            render: function() {
              return (
                <div />
              );
            }
          })
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
      var helpCenter = React.render(
            <HelpCenter />,
            global.document.body
          );

    expect(helpCenter.state.articles)
      .toEqual([]);
  });

  describe('handle change', function() {

    it('should fire off call to search api when handleSubmit is called', function() {
      var mockBeacon = jasmine.createSpy('mockOnSearch'),
          helpCenter = React.render(
            <HelpCenter onSearch={mockBeacon} />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          responsePayload = {body: {results: [1,2,3], count: 3}};

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

      expect(mockBeacon).toHaveBeenCalled();
    });

    it('should render list of results from api', function() {
      var helpCenter = React.render(
            <HelpCenter onSearch={noop} />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          searchString = 'help, I\'ve fallen and can\'t get up!',
          responsePayload = {body: {results: [1,2,3], count: 4}, ok: true},
          listAnchor = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'List');

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayload);

      expect(listAnchor.props.className)
        .not.toContain('u-isHidden');
    });

    it('should render the inline article', function() {
      var helpCenter = React.render(
            <HelpCenter
              onSearch={noop}
              onLinkClick={noop}
              showBackButton={noop} />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          searchString = 'help, I\'ve fallen and can\'t get up!',
          responseArticle = {
            /* jshint camelcase: false */
            id: 0,
            title: 'bob',
            name: 'bob',
            html_url: 'bob.com'
          },
          responsePayload = {
            body: {
              results: [responseArticle, responseArticle, responseArticle],
              count: 3
            },
            ok: true
          },
          article = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'UserContent')
                    .getDOMNode()
                    .parentNode,
          listItem,
          listAnchor;

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayload);

      listItem = ReactTestUtils.scryRenderedDOMComponentsWithClass(helpCenter, 'List-item')[0];
      listAnchor = ReactTestUtils.findRenderedDOMComponentWithTag(listItem, 'a');

      expect(article.className)
        .toMatch('u-isHidden');

      ReactTestUtils.Simulate.click(listAnchor, {
        target: { getAttribute: function() { return 0; }
      }});

      expect(article.className)
        .not.toMatch('u-isHidden');
    });

    it('should render error message when search fails', function() {
      var helpCenter = React.render(
            <HelpCenter onSearch={noop} />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          searchString = 'help, I\'ve fallen and can\'t get up!',
          responsePayload = {ok: false},
          list = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'List');

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      console.log(responsePayload);
      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayload);

      expect(list.props.className).
        toContain('u-isHidden');

      expect(helpCenter.getDOMNode().querySelector('#noResults').className)
        .not.toContain('u-isHidden');
    });

    it('should show no results when search returns no results', function() {
      var helpCenter = React.render(
            <HelpCenter onSearch={noop} />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          searchString = 'abcd',
          responsePayload = {body: {results: [], count: 0}},
          list = ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'List');

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      mockTransport.send.calls.mostRecent().args[0].callbacks.done(responsePayload);

      expect(helpCenter.state.searchCount)
        .toBeFalsy();

      expect(list.props.className)
        .toContain('u-isHidden');
    });

    it('shouldn\'t call handle search if the string isn\'t valid', function() {
      var helpCenter = React.render(
            <HelpCenter />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          returnSearchTerm = function(term) { return term; },
          mockGetValue = helpCenter.refs.searchField.getValue,
          searchStringTooShort = 'hi! ',
          searchStringNoSpace = 'help, I\'ve fallen and can\'t get up!';

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
