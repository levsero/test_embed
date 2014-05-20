/** @jsx React.DOM */
var SubmitTicket;

describe('submit ticket form', function() {

  beforeEach(function() {

    mockery.enable({
      warnOnReplace:false
    });

    var submitTicketPath = buildPath('component/SubmitTicket');

    mockery.registerMock('service/identity', {});
    mockery.registerMock('service/transport', {});
    mockery.registerMock('component/TextAreaInput', {
      TextAreaInput: reactMocks.getMockFunction()
    });
    mockery.registerMock('mixin/validation', {
      validation: {
        baseValidation: [{test: function() {}, message: ''}],
        emailValidation: function() {},
        ValidationMixin: function() {}
      }
    });
    mockery.registerMock('imports?_=lodash!lodash', {});
    mockery.registerMock('component/TextInput', {
      TextInput: reactMocks.getMockFunction()
    });
    mockery.registerAllowable(submitTicketPath);
    mockery.registerAllowable('react');
    mockery.registerAllowable('./lib/React');
    SubmitTicket = require(submitTicketPath).SubmitTicket;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should be added to the document when called', function () {
    var form = React.renderComponent(<SubmitTicket />, global.document.body);
    expect(form.getDOMNode()).toBeDefined();
  });
});

