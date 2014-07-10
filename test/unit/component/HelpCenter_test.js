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
      'component/ZdForm': {
        ZdForm: jasmine.createSpy('mockZdForm')
          .andCallFake(React.createClass({
            render: function() {
              return <form onSubmit={this.props.handleSubmit} />;
            }
          }))
      },
      'mixin/searchFilter': {
        stopWordsFilter: noop
      },
      'react-forms': {
        schema: {
          Property: jasmine.createSpy('mockReactFormsSchemaProperty'),
          Schema: jasmine.createSpy('mockReactFormsSchemaSchema')
        }
      },
      'component/HelpCenterSchema': {
        helpCenterSchema: jasmine.createSpy('mockHelpCenterSchema')
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
          mockTransport = mockRegistry['service/transport'].transport,
          searchString = 'help, I\'ve fallen and can\'t get up! ';

      helpCenter.handleChange({description: searchString});

      expect(mockTransport.send)
        .toHaveBeenCalled();

    });

    it('shouldn\'t call handle search if the string isn\'t valid', function() {
      var helpCenter = React.renderComponent(
            <HelpCenter />,
            global.document.body
          ),
          mockTransport = mockRegistry['service/transport'].transport,
          searchStringTooShort = 'hi! ',
          searchStringNoSpace = 'help, I\'ve fallen and can\'t get up!';

      helpCenter.handleChange({description: searchStringTooShort});

      expect(mockTransport.send)
        .not.toHaveBeenCalled();

      helpCenter.handleChange({description: searchStringNoSpace});

      expect(mockTransport.send)
        .not.toHaveBeenCalled();
    });
  });

  it('should pass schema and submit callback props to ZdForm component', function() {
    var mostRecentCall,
        mockZdForm = mockRegistry['component/ZdForm'].ZdForm,
        mockSchema = mockRegistry['component/HelpCenterSchema'];

    React.renderComponent(
      <HelpCenter />,
      global.document.body
    );

    mostRecentCall = mockZdForm.mostRecentCall.args[0];
    mostRecentCall.schema('token_schema');

    expect(mockSchema.helpCenterSchema)
      .toHaveBeenCalledWith('token_schema');

    expect(mockSchema.helpCenterSchema.callCount)
      .toEqual(1);
  });

});
