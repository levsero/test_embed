/** @jsx React.DOM */

describe('Submit ticket component', function() {
  var SubmitTicket,
      defaultValue = '123abc',
      mockValidation = {
        baseValidation: noop,
        emailValidation: noop,
        ValidationMixin: noop
      },
      mockIdentity = {
        getBuid: function() {
          return 'abc123';
        }
      },
      mockComponent = React.createClass({
        getInitialState: function() {
          return {value: defaultValue, errors: []};
        },
        render: function() {
          /* jshint quotmark: false */
          return <input ref='inputText' value={this.state.value}></input>;
        }
      }),
      mockGlobals = {
        win: window
      },
      formParams = {
        'email': defaultValue,
        'description': defaultValue,
        'set_tags': 'buid-abc123 DROPBOX',
        'submitted_from': global.window.location.href
      },
      payload = {
        method: 'POST',
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

    transport.send.reset();

    var submitTicketPath = buildPath('component/SubmitTicket');

    mockery.registerMock('service/identity', {
      identity: mockIdentity
    });
    mockery.registerMock('service/transport', {
      transport: transport
    });
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('imports?_=lodash!lodash', {});
    mockery.registerMock('component/TextAreaInput', {
      TextAreaInput: mockComponent
    });
    mockery.registerMock('mixin/validation', {
      validation: mockValidation
    });
    mockery.registerMock('component/TextInput', {
      TextInput: mockComponent
    });
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

  it('should hide the form when the showNotification state is changed', function() {
    var submitTicket = React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    expect(global.document.body.querySelectorAll('.u-isHidden').length)
      .toEqual(1);

    submitTicket.setState({showNotification: true});

    expect(global.document.body.querySelectorAll('.u-isHidden').length)
      .toEqual(2);
  });

  it('should call handleSubmit when the is submitted with the correct payload', function() {
    var recentCall;

    React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    ReactTestUtils.Simulate.submit(global.document.body.querySelector('form'));

    expect(transport.send)
      .toHaveBeenCalled();

    recentCall = transport.send.mostRecentCall;

    expect(recentCall.args[0].params)
      .toEqual(payload.params);
  });

  it('should not send if there are errors', function() {
    var submitTicket = React.renderComponent(
          <SubmitTicket />,
          global.document.body
        );

    submitTicket.refs.emailField.setState({errors:['something']});

    ReactTestUtils.Simulate.submit(global.document.body.querySelector('form'));

    expect(transport.send)
      .not.toHaveBeenCalled();
  });
});
