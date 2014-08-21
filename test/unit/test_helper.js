// This file is autoloaded by jasmine
// because it has 'helper' in its name.

global.basePath = function(path) {
  return __dirname + '/../../../' + path;
};

global.buildSrcPath = function(path) {
  return basePath('build/src/' + path);
};

global.buildTestPath = function(path) {
  return basePath('build/test/' + path);
};

global._ = require('lodash');

global.Airbrake = jasmine.createSpyObj('Airbrake', ['push', 'wrap', 'setProject']);

global.mockery = require('mockery');

global.jsdom = require('jsdom');

global.window = jsdom.jsdom().createWindow('<html><body></body></html>');

global.document = global.window.document;
global.navigator = global.window.navigator;

global.React = require('react/addons');
global.ReactTestUtils = React.addons.TestUtils;

global.noop = function() {};

// TODO: This suppresses the warnings and errors in put tests for now.
// Once the components and component tests are refactored this should be removed.
console.warn = console.error = noop;

global.resetDOM = function() {
  global.document.head.innerHTML = '';
  global.document.body.innerHTML = '';
};

global.initMockRegistry = function(registry) {
  _.forEach(registry, function(value, key) {
    mockery.registerMock(key, value);
  });
  return registry;
};

global.dispatchEvent = function(eventName, node) {
  var event = global.document.createEvent('HTMLEvents');

  event.initEvent(eventName, true, true);
  event.touches = [0,0];
  node.dispatchEvent(event);
};
