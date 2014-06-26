/** @jsx React.DOM */

describe('Submit ticket component', function() {
  var SubmitTicket,
      defaultValue = '123abc',
      mockIdentity = {
        getBuid: function() {
          return 'abc123';
        }
      },
      mockComponent = jasmine.createSpy('mockComponent')
        .andCallFake(React.createClass({
          getInitialState: function() {
            return {
              showNotification: false,
              message: false,
              uid: defaultValue
            };
          },
          render: function() {
            /* jshint quotmark: false */
            return <form onSubmit={this.props.handleSubmit} />;
          }
        })),
      mockSchema = {
        submitTicketSchema: jasmine.createSpy()
      },
      mockGlobals = {
        win: window
      },
      formParams = {
        'set_tags': 'buid-abc123 DROPBOX',
        'submitted_from': global.window.location.href,
        'email': defaultValue,
        'description': defaultValue
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
      transport = jasmine.createSpyObj('transport', ['send']),
      submitTicketPath = buildSrcPath('component/SubmitTicket');

  beforeEach(function() {

    mockery.enable({
      warnOnReplace:false
    });

    this.addMatchers({
      toBeJSONEqual: function(expected) {
        return JSON.stringify(this.actual) === JSON.stringify(expected);
      }
    });

    transport.send.reset();

    mockery.registerMock('component/ZdForm', {
      ZdForm: mockComponent,
      MessageFieldset: noop,
      EmailField: noop
    });
    mockery.registerMock('component/SubmitTicketSchema', mockSchema);
    mockery.registerMock('service/identity', {
      identity: mockIdentity
    });
    mockery.registerMock('service/transport', {
      transport: transport
    });
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('imports?_=lodash!lodash', {});
    mockery.registerAllowable(submitTicketPath);
    mockery.registerAllowable('react');
    mockery.registerAllowable('./lib/React');
    mockery.registerAllowable('util/globals');

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
    React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );
    var mostRecentCall = mockComponent.mostRecentCall.args[0];
    mostRecentCall.schema('token_schema');

    expect(mockSchema.submitTicketSchema)
      .toHaveBeenCalledWith('token_schema');

    expect(mockSchema.submitTicketSchema.callCount)
      .toEqual(1);
  });

  it('should not submit form when invalid', function() {
    React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );
    var mostRecentCall = mockComponent.mostRecentCall.args[0];

    mostRecentCall.submit({preventDefault: noop}, {isFormInvalid: true});

    expect(transport.send)
      .not.toHaveBeenCalled();
  });

  it('should submit form when valid', function() {
    var mockComponentRecentCall = mockComponent.mostRecentCall.args[0],
        transportRecentCall;

    React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    mockComponentRecentCall.submit({preventDefault: noop}, {
      isFormInvalid: false,
      value: {
        email: defaultValue,
        description: defaultValue
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
        notificationElem = ReactTestUtils.findRenderedDOMComponentWithClass(submitTicket, 'Notify');

    expect(notificationElem.props.className)
      .toContain('u-isHidden');

    submitTicket.setState({showNotification: true});

    expect(notificationElem.props.className)
      .not.toContain('u-isHidden');
  });
});
