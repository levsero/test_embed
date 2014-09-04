/** @jsx React.DOM */

describe('Help center component', function() {
  var HelpCenter,
      mockRegistry,
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
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['init', 'setLocale', 't'])
      },
      'mixin/searchFilter': {
        stopWordsFilter: function(str) {
          return str;
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
      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          searchString = 'help, I\'ve fallen and can\'t get up!',
          callbackPayload = '{"results": [1,2,3],"count": 3}';

      helpCenter.handleSubmit({preventDefault: noop}, { value: searchString });

      expect(helpCenter.state.isLoading)
        .toBeTruthy();

      expect(helpCenter.state.searchTerm)
        .toEqual(searchString);

      expect(mockTransport.send)
        .toHaveBeenCalled();

      mockTransport.send.mostRecentCall.args[0].callbacks.done(callbackPayload);

      expect(helpCenter.state.isLoading)
        .toBeFalsy();
    });

    it('should render list of results from api', function() {
      var helpCenter = React.renderComponent(
            <HelpCenter />,
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

    it('shouldn\'t call handle search if the string isn\'t valid', function() {
      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          searchStringTooShort = 'hi! ',
          searchStringNoSpace = 'help, I\'ve fallen and can\'t get up!';

      helpCenter.handleSearch(searchStringTooShort);
      helpCenter.handleSearch(searchStringNoSpace);

      expect(mockTransport.send.callCount)
        .toEqual(1);
    });
  });
});
