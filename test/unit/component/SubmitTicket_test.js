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
            return {value: defaultValue, errors: []};
          },
          render: function() {
            /* jshint quotmark: false */
            return <form onSubmit={this.props.handleSubmit} />;
          }
        })),
      mockSchema = {
        submitTicketSchema: noop
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
      transport = jasmine.createSpyObj('transport', ['send']);

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

    var submitTicketPath = buildPath('component/SubmitTicket');

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
    console.log(typeof React.renderComponent);
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

    expect(typeof mostRecentCall.schema)
      .toEqual('function');

    expect(typeof mostRecentCall.submit)
      .toEqual('function');
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
    React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    var mockComponentRecentCall = mockComponent.mostRecentCall.args[0],
        transportRecentCall;

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
});
