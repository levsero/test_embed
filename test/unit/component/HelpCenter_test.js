/** @jsx React.DOM */

describe('Help center component', function() {
  var HelpCenter,
      mockRegistry,
      searchFieldBlur = jasmine.createSpy(),
      searchFieldGetValue = jasmine.createSpy().andReturn('Foobar'),
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
      'component/HelpCenterForm': {
        HelpCenterForm: jasmine.createSpy('mockHelpCenterForm')
          .andCallFake(React.createClass({
            render: function() {
              return (<form onSubmit={this.handleSubmit}>
                {this.props.children}
              </form>);
            }
          }))
      },
      'component/FormField': {
        SearchField: jasmine.createSpy('mockSearchField')
          .andCallFake(React.createClass({
            blur: searchFieldBlur,
            getValue: searchFieldGetValue,
            render: function() {
              /* jshint quotmark:false */
              return (
                <input ref='searchField' type='search' />
              );
            }
          }))
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['init', 'setLocale', 't'])
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
      'imports?_=lodash!lodash': _
    });

    mockery.registerAllowable(helpCenterPath);

    HelpCenter = require(helpCenterPath).HelpCenter;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly set the initial states when created', function() {
      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          transportSendCall = mockTransport.send.mostRecentCall.args[0];

    expect(mockTransport.send)
      .toHaveBeenCalled();

    /* jshint camelcase:false */
    expect(transportSendCall.query.zendesk_path)
      .toEqual('/api/v2/help_center/categories.json');

    expect(helpCenter.state.topics)
      .toEqual([]);
  });

  describe('handle change', function() {

    it('should fire off call to search api when handleSubmit is called', function() {
      var mockBeacon = jasmine.createSpy('mockOnSearch'),
          helpCenter = React.renderComponent(
            <HelpCenter onSearch={mockBeacon} />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          callbackPayload = '{"results": [1,2,3],"count": 3}';

      helpCenter.handleSubmit({preventDefault: noop});

      expect(helpCenter.state.isLoading)
        .toBeTruthy();

      expect(helpCenter.state.searchTerm)
        .toEqual('Foobar');

      expect(mockTransport.send)
        .toHaveBeenCalled();

      expect(searchFieldBlur)
        .toHaveBeenCalled();

      expect(searchFieldGetValue)
        .toHaveBeenCalled();

      mockTransport.send.mostRecentCall.args[0].callbacks.done(callbackPayload);

      expect(helpCenter.state.isLoading)
        .toBeFalsy();

      expect(mockBeacon).toHaveBeenCalled();
    });

    it('should render list of results from api', function() {
      var helpCenter = React.renderComponent(
            <HelpCenter onSearch={noop} />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          searchString = 'help, I\'ve fallen and can\'t get up!',
          callbackPayload = '{"results": [1,2,3],"count": 4}',
          viewAllAnchor = ReactTestUtils.scryRenderedDOMComponentsWithTag(helpCenter, 'a')[0];

      expect(viewAllAnchor.props.className)
        .toContain('u-isHidden');

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      mockTransport.send.mostRecentCall.args[0].callbacks.done(callbackPayload);

      expect(ReactTestUtils.findRenderedDOMComponentWithClass(helpCenter, 'List'))
        .toBeDefined();

      expect(viewAllAnchor.props.className)
        .toNotContain('u-isHidden');
    });

    it('should show no results message when search returns no results', function() {
      var helpCenter = React.renderComponent(
            <HelpCenter onSearch={noop} />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          searchString = 'abcd',
          callbackPayload = '{"results": [],"count": 0}',
          noResultsMsg = ReactTestUtils.scryRenderedDOMComponentsWithTag(helpCenter, 'p')[0];

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });
      mockTransport.send.mostRecentCall.args[0].callbacks.done(callbackPayload);

      expect(helpCenter.state.searchCount)
        .toBeFalsy();

      expect(noResultsMsg.props.className)
        .toNotContain('u-isHidden');
    });

    it('shouldn\'t call handle search if the string isn\'t valid', function() {
      var helpCenter = React.renderComponent(
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

      expect(mockTransport.send.callCount)
        .toEqual(1);
    });
  });

  describe('fullscreen state', function() {
    it('should be true if isMobileBrowser() is true', function() {

      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return true;
      };

      mockery.resetCache();
      HelpCenter = require(helpCenterPath).HelpCenter;

      var helpCenter = React.renderComponent(
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

      var helpCenter = React.renderComponent(
        <HelpCenter />,
        global.document.body
      );

      expect(helpCenter.state.fullscreen)
        .toEqual(false);
    });
  });

  describe('container <div> class names', function() {
    it('should have the `fullscreen` classnames when fullscreen is true', function() {

      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          containerNode = ReactTestUtils
            .findRenderedDOMComponentWithClass(helpCenter, 'Container'),
          containerClasses;

      helpCenter.setState({fullscreen: true});

      containerClasses = containerNode.props.className;

      expect(containerClasses.indexOf('Container--fullscreen') >= 0)
        .toEqual(true);

      expect(containerClasses.indexOf('Container--popover'))
        .toEqual(-1);
    });

    it('should have the `popover` classnames when fullscreen is false', function() {

      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          containerNode = ReactTestUtils
            .findRenderedDOMComponentWithClass(helpCenter, 'Container'),
          containerClasses;

      helpCenter.setState({fullscreen: false});

      containerClasses = containerNode.props.className;

      expect(containerClasses.indexOf('Container--popover') >= 0)
        .toEqual(true);

      expect(containerClasses.indexOf('Container--fullscreen'))
        .toEqual(-1);
    });

  });

  describe('logo class names', function() {
    it('should have the `fullscreen` classnames when fullscreen is true', function() {

      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          logoNode = ReactTestUtils
            .findRenderedDOMComponentWithClass(helpCenter, 'Icon--zendesk'),
          logoClasses;

      helpCenter.setState({fullscreen: true});

      logoClasses = logoNode.props.className;

      expect(logoClasses.indexOf('u-posAbsolute'))
        .toEqual(-1);

      expect(logoClasses.indexOf('u-posStart'))
        .toEqual(-1);

    });

    it('should not have the `fullscreen` classnames when fullscreen is false', function() {

      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          logoNode = ReactTestUtils
            .findRenderedDOMComponentWithClass(helpCenter, 'Icon--zendesk'),
          logoClasses;

      helpCenter.setState({fullscreen: false});

      logoClasses = logoNode.props.className;

      expect(logoClasses.indexOf('u-posAbsolute') >= 0)
        .toEqual(true);

      expect(logoClasses.indexOf('u-posStart') >= 0)
        .toEqual(true);

    });

  });

  it('should pass on fullscreen to helpCenterForm', function() {
    var mostRecentCall,
        helpCenter,
        mockHelpCenterForm = mockRegistry['component/HelpCenterForm'].HelpCenterForm;

    helpCenter = React.renderComponent(
      <HelpCenter />,
      global.document.body
    );

    helpCenter.setState({fullscreen: 'VALUE'});
    mostRecentCall = mockHelpCenterForm.mostRecentCall.args[0];

    expect(mostRecentCall.fullscreen)
      .toEqual('VALUE');
  });
});
