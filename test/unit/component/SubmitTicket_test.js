/** @jsx React.DOM */

describe('Submit ticket component', function() {
  var SubmitTicket,
      mockIdentity = {
        getBuid: function() {
          return 'abc123';
        }
      },
      mockZdForm,
      mockSubmitTicketSchema,
      mockGlobals = {
        win: window
      },
      formParams = {
        'set_tags': 'buid-abc123 DROPBOX',
        'submitted_from': global.window.location.href,
        'email': 'mock@email.com',
        'description': 'Mock Description'
      },
      payload = {
        method: 'post',
        path: '/api/ticket_submission',
        params: formParams,
        callbacks: {
          done: noop,
          fail: noop
        }
      },
      transport,
      submitTicketPath = buildSrcPath('component/SubmitTicket');

  beforeEach(function() {
    var mockRegistry;

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    this.addMatchers({
      toBeJSONEqual: function(expected) {
        return JSON.stringify(this.actual) === JSON.stringify(expected);
      }
    });

    mockZdForm = jasmine.createSpy('mockZdForm')
      .andCallFake(React.createClass({
      render: function() {
        return <form onSubmit={this.props.handleSubmit} />;
      }
    }));

    mockSubmitTicketSchema = jasmine.createSpy();

    transport = jasmine.createSpyObj('transport', ['send']),

    mockRegistry = {
      'react/addons': React,
      'util/globals': mockGlobals,
      'component/ZdForm': {
        ZdForm: mockZdForm,
        MessageFieldset: noop,
        EmailField: noop
      },
      'service/identity': {
        identity: mockIdentity
      },
      'service/transport': {
        transport: transport
      },
      'component/SubmitTicketSchema': {
        submitTicketSchema: mockSubmitTicketSchema
      },
      'imports?_=lodash!lodash': _
    };

    _.forEach(mockRegistry, function(value, key) {
      mockery.registerMock(key, value);
    });

    mockery.registerAllowable(submitTicketPath);

    SubmitTicket = require(submitTicketPath).SubmitTicket;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly set the initial states when created', function() {
    var submitTicket = React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    expect(submitTicket.state.showNotification)
      .toEqual(false);

    expect(submitTicket.state.message)
      .toEqual('');
  });

  it('should pass schema and submit callback props to ZdForm component', function() {
    var mostRecentCall;

    React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    mostRecentCall = mockZdForm.mostRecentCall.args[0];
    mostRecentCall.schema('token_schema');

    expect(mockSubmitTicketSchema)
      .toHaveBeenCalledWith('token_schema');

    expect(mockSubmitTicketSchema.callCount)
      .toEqual(1);
  });

  it('should not submit form when invalid', function() {
    var mostRecentCall;

    React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    mostRecentCall = mockZdForm.mostRecentCall.args[0];

    mostRecentCall.submit({preventDefault: noop}, {isFormInvalid: true});

    expect(transport.send)
      .not.toHaveBeenCalled();
  });

  it('should submit form when valid', function() {
    var mostRecentCall,
        transportRecentCall;

    React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    mostRecentCall = mockZdForm.mostRecentCall.args[0],

    mostRecentCall.submit({preventDefault: noop}, {
      isFormInvalid: false,
      value: {
        email: formParams['email'],
        description: formParams['description']
      }
    });

    transportRecentCall = transport.send.mostRecentCall.args[0];

    expect(transportRecentCall)
      .toBeJSONEqual(payload);
  });

  it('should unhide notification element on state change', function() {
    var submitTicket = React.renderComponent(
          <SubmitTicket />,
          global.document.body
        ),
        notificationElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(submitTicket, 'Notify');

    expect(notificationElem.props.className)
      .toContain('u-isHidden');

    submitTicket.setState({showNotification: true});

    expect(notificationElem.props.className)
      .not.toContain('u-isHidden');
  });
});
