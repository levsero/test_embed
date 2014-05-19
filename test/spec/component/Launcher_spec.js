/** @jsx React.DOM */
var React;
var ReactTestUtils;
var mockery = require('mockery');
var jsdom = require("jsdom");
var reactMocks = require('../helpers/mocks');
var Launcher;

describe('Launcher component', function() {
  beforeEach(function() {
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = global.window.document;
    global.navigator = global.window.navigator;
    React = require('react/addons');
    ReactTestUtils = React.addons.TestUtils;

    mockery.enable({
      warnOnReplace:false
    });

    mockery.registerAllowable('../../build/unes6/component/Launcher');
    mockery.registerAllowable('react');
    mockery.registerAllowable('./lib/React');
    Launcher = require('../../build/unes6/component/Launcher').Launcher;
  });

  it('should be added to the document when called', function () {
    var launcher = React.renderComponent(<Launcher />, global.document.body);
    expect(launcher.getDOMNode()).toBeDefined();
  });
});

