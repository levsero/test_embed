// This file is autoloaded by jasmine
// because it has 'helper' in its name.

global.basePath = function(path) {
  return __dirname + '/../../' + path;
};

global.buildSrcPath = function(path) {
  return basePath('src/' + path);
};

global.buildTestPath = function(path) {
  return basePath('test/' + path);
};

global._ = require('lodash');

global.requireUncached = require('require-uncached');

global.Airbrake = jasmine.createSpyObj('Airbrake', ['push', 'wrap', 'setProject', 'addFilter']);

global.mockery = require('mockery');

global.jsdom = require('jsdom');

global.window = jsdom.jsdom('<html><body></body></html>').defaultView;

global.document = global.window.document;
global.navigator = global.window.navigator;
global.location = global.window.location;

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ShallowTestUtils from 'react-shallow-testutils';

global.React = React;
global.ReactDOM = ReactDOM;
global.TestUtils = TestUtils;

global.noopReactComponent = function() {
  return React.createClass({
    render: () => <div />
  });
};

global.shallowRender = (component) => {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
};

global.instanceRender = (component) => {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return ShallowTestUtils.getMountedInstance(renderer);
};

global.noop = function() {};

// TODO: This suppresses the warnings and errors in put tests for now.
// Once the components and component tests are refactored this should be removed.
/* eslint no-console:0 */
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

global.pluckSubscribeCall = function(mediator, key) {
  const calls = mediator.channel.subscribe.calls.allArgs();

  return _.find(calls, function(call) {
    return call[0] === key;
  })[1];
};

global.dispatchEvent = function(eventName, node) {
  const event = global.document.createEvent('HTMLEvents');

  event.initEvent(eventName, true, true);
  event.touches = [0, 0];
  node.dispatchEvent(event);
};

global.mockBindMethods = (instance, prototype) => {
  const methods = Object.getOwnPropertyNames(prototype);
  methods.forEach((method) => {
    instance[method] = instance[method].bind(instance);
  });
}

global.__DEV__ = true;
