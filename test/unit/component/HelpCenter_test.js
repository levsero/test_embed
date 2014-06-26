/** @jsx React.DOM */

describe('Help center component', function() {
  var HelpCenter,
      mockComponent = jasmine.createSpy('mockComponent')
        .andCallFake(React.createClass({
          render: function() {
            return <form onSubmit={this.props.handleSubmit} />;
          }
        })),
      mockSchema = {
        helpCenterSchema: jasmine.createSpy()
      },
      transport = jasmine.createSpyObj('transport', ['send']);

  beforeEach(function() {

    transport.send.reset();

    mockery.enable({
      warnOnReplace:false
    });

    var helpCenterPath = buildSrcPath('component/HelpCenter');

    mockery.registerMock('imports?_=lodash!lodash', {});
    mockery.registerMock('react-forms', {
      schema: {
        Property: mockComponent,
        Schema: mockComponent
      }
    });
    mockery.registerMock('component/ZdForm', {
      ZdForm: mockComponent
    });
    mockery.registerMock('mixin/searchFilter', {
      filter: noop
    });
    mockery.registerMock('service/transport', {
      transport: transport
    });
    mockery.registerMock('component/HelpCenterSchema', mockSchema);
    mockery.registerAllowable(helpCenterPath);
    mockery.registerAllowable('react');
    mockery.registerAllowable('react-forms');
    mockery.registerAllowable('./lib/React');

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
          searchString = 'help, I\'ve fallen and can\'t get up! ',
          event = {description: searchString};

      helpCenter.handleChange(event);

      expect(transport.send)
        .toHaveBeenCalled();

    });

    it('should call handle search if the string isn\'t valid', function() {
      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          searchStringToShort = 'hi! ',
          searchStringNoSpace = 'help, I\'ve fallen and can\'t get up!',
          event = {description: searchStringToShort};

      helpCenter.handleChange(event);

      expect(transport.send)
        .not.toHaveBeenCalled();

      event = {description: searchStringNoSpace};
      helpCenter.handleChange(event);

      expect(transport.send)
        .not.toHaveBeenCalled();
    });
  });

  it('should pass schema and submit callback props to ZdForm component', function() {
    React.renderComponent(
      <HelpCenter />,
      global.document.body
    );
    var mostRecentCall = mockComponent.mostRecentCall.args[0];
    mostRecentCall.schema('token_schema');

    expect(mockSchema.helpCenterSchema)
      .toHaveBeenCalledWith('token_schema');

    expect(mockSchema.helpCenterSchema.callCount)
      .toEqual(1);
  });

});
