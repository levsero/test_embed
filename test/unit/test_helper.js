// This file is autoloaded by jasmine
// because it has 'helper' in its name.

console.log('loading test_helper');

global.basePath = function(path) {
  return __dirname + '/../../../' + path;
};

global.buildPath = function(path) {
  return basePath('build/src/' + path);
};

global._ = require('lodash');

global.mockery = require('mockery');

global.jsdom = require('jsdom');

global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
global.document = global.window.document;
global.navigator = global.window.navigator;

global.React = require('react/addons');
global.ReactTestUtils = React.addons.TestUtils;
