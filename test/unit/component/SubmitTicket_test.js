/** @jsx React.DOM */

describe('Submit ticket component', function() {
  var SubmitTicket,
      mockGlobals = {
        win: global.window.top
      },
      mockComponent = React.createClass({
        getInitialState: function() {
          return {value: 'x@x.com', errors: []};
        },
        render: function() {
          return <input ref='inputText' value={this.state.value}></input>;
        }
      }),
      tags = ['buid-' + 'abc123' , 'DROPBOX'].join(' '),
      formParams = {
        'subject': 'x@x.com',
        'name': 'x@x.com',
        'email': 'x@x.com',
        'description': 'x@x.com',
        'set_tags': tags,
        'submitted_from': global.window.location.href
      },
      payload = {
        method: 'POST',
        path: '/api/ticket_submission',
        params: formParams,
        callbacks: {
          done: function() {
            form.setState({
              showNotification: true,
              message: 'Ticket Submitted! Thanks!'
            });
          },
          fail: function(data, status) {
            form.setState({
              showNotification: true,
              message: 'Error ' + status + ': ' + JSON.parse(data).error
            });
          }
        }
      },
      transport = jasmine.createSpyObj('mockTransport', ['send']);

  beforeEach(function() {

    mockery.enable({
      warnOnReplace:false
    });
    transport.send.reset();

    var submitTicketPath = buildPath('component/SubmitTicket');

    mockery.registerMock('service/identity', {
      identity: {
        getBuid: jasmine.createSpy('getBuid').andReturn('abc123')
      }
    });
    mockery.registerMock('service/transport', {transport: transport});
    mockery.registerMock('util/globals', {win: document});
    mockery.registerMock('component/TextAreaInput', {
      TextAreaInput: mockComponent
    });
    mockery.registerMock('mixin/validation', {
      validation: {
        baseValidation: noop,
        emailValidation: noop,
        ValidationMixin: noop
      }
    });
    mockery.registerMock('imports?_=lodash!lodash', {});
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
      .toBe(false);

    expect(submitTicket.state.message)
      .toBe('');
  });

  it('should hide the form when the showNotification state is changed', function() {
    var submitTicket = React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    expect(global.document.body.querySelectorAll('.u-isHidden').length)
      .toBe(1);

    submitTicket.setState({showNotification: true});

    expect(global.document.body.querySelectorAll('.u-isHidden').length)
      .toBe(2);
  });

  it('should call handleSubmit when the button is pressed', function() {
    var submitTicket = React.renderComponent(
          <SubmitTicket />,
          global.document.body
        );

    ReactTestUtils.Simulate.submit(global.document.body.querySelector('input'));

    expect(transport.send).toHaveBeenCalled();
  });

  it('should send through the correct payload', function() {
    var submitTicket = React.renderComponent(
          <SubmitTicket />,
          global.document.body
        );

    ReactTestUtils.Simulate.submit(global.document.body.querySelector('input'));

    var recentCall = transport.send.mostRecentCall;

    expect(recentCall.args[0].params).toEqual(payload.params);
  });

  it('not send the payload if there are errors', function() {
    var submitTicket = React.renderComponent(
          <SubmitTicket />,
          global.document.body
        );

    submitTicket.refs.emailField.setState({errors:['something']});

    ReactTestUtils.Simulate.submit(global.document.body.querySelector('input'));

    expect(transport.send).not.toHaveBeenCalled();
  });
});
