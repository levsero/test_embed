/** @jsx React.DOM */
var React;
var ReactTestUtils;
var mockery = require('mockery');
var jsdom = require("jsdom");
var reactMocks = require('../helpers/mocks');
var SubmitTicket;

describe('submit ticket form', function() {

  beforeEach(function() {
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = global.window.document;
    global.navigator = global.window.navigator;
    React = require('react/addons');
    ReactTestUtils = React.addons.TestUtils;

    mockery.enable({
      warnOnReplace:false
    });

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
    mockery.registerAllowable('../../build/unes6/component/SubmitTicket');
    mockery.registerAllowable('react');
    mockery.registerAllowable('./lib/React');
    SubmitTicket = require('../../build/unes6/component/SubmitTicket').SubmitTicket;
  });

  it('should be added to the document when called', function () {
    var form = React.renderComponent(<SubmitTicket />, global.document.body);
    expect(form.getDOMNode()).toBeDefined();
  });
});

