/** @jsx React.DOM */

describe('Help center component', function() {
  var HelpCenter,
      mockComponent,
      mockSchema,
      transport = jasmine.createSpyObj('transport', ['send']),
      helpCenterPath = buildSrcPath('component/HelpCenter');

  beforeEach(function() {

    transport.send.reset();

    mockery.enable({
      useCleanCache: true
    });

    mockery.resetCache();

    mockComponent = jasmine.createSpy('mockComponent')
      .andCallFake(React.createClass({
        render: function() {
          return <form onSubmit={this.props.handleSubmit} />;
        }
      }));

    mockSchema = {
      helpCenterSchema: jasmine.createSpy()
    };

    mockery.registerMock('imports?_=lodash!lodash', {});

    mockery.registerMock('react-forms', {
      schema: {
        Property: mockComponent,
        Schema: mockComponent
      }
    });
    mockery.registerMock('component/ZdForm', {
      ZdForm: mockComponent,
    });
    mockery.registerMock('mixin/searchFilter', {
      stopWordsFilter: noop
    });
    mockery.registerMock('service/transport', {
      transport: transport
    });
    mockery.registerMock('component/HelpCenterSchema', mockSchema);
    mockery.registerMock('react/addons', React);
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
    );

    expect(helpCenter.state.topics)
      .toEqual([]);
  });

  describe('handle change', function() {

    it('should call handle search if the string is valid', function() {
      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          searchString = 'help, I\'ve fallen and can\'t get up! ';

      helpCenter.handleChange({description: searchString});

      expect(transport.send)
        .toHaveBeenCalled();

    });

    it('shouldn\t call handle search if the string isn\'t valid', function() {
      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          searchStringTooShort = 'hi! ',
          searchStringNoSpace = 'help, I\'ve fallen and can\'t get up!';

      helpCenter.handleChange({description: searchStringTooShort});

      expect(transport.send)
        .not.toHaveBeenCalled();

      helpCenter.handleChange({description: searchStringNoSpace});

      expect(transport.send)
        .not.toHaveBeenCalled();
    });
  });

  it('should pass schema and submit callback props to ZdForm component', function() {
    var mostRecentCall;
    React.renderComponent(
      <HelpCenter />,
      global.document.body
    );

    mostRecentCall = mockComponent.mostRecentCall.args[0];
    mostRecentCall.schema('token_schema');

    expect(mockSchema.helpCenterSchema)
      .toHaveBeenCalledWith('token_schema');

    expect(mockSchema.helpCenterSchema.callCount)
      .toEqual(1);
  });

});
