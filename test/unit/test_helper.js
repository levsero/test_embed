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

global.mockery = require('mockery');

global.jsdom = require('jsdom');

global.window = jsdom.jsdom('<html><body></body></html>').defaultView;

global.document = global.window.document;
global.navigator = global.window.navigator;
global.location = global.window.location;

/*
  Tests are failing because DOM is missing or unexpectedly mutated.
  The reason is because `import` is hoisted at the top and evaluated first before the DOM is ready.
  If we are using modules to perform actions on the DOM that isn't ready it will blow up.
  Source: https://gist.github.com/PrototypeAlex/0a2b9a5c3e86ee0c8ed3
*/
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Enzyme = require('enzyme');

global.React = React;
global.Component = React.Component;
global.ReactDOM = ReactDOM;
global.TestUtils = TestUtils;
global.Enzyme = Enzyme;
global.shallow = Enzyme.shallow;
global.mount = Enzyme.mount;

global.noopReactComponent = () => class extends Component {
  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
};

global.scrollContainerComponent = () => class extends Component {
  render() {
    return (
      <div>
        <div className={this.props.headerClasses}>
          {this.props.headerContent}
        </div>
        <div className={this.props.containerClasses}>
          {this.props.children}
        </div>
        <div className={this.props.footerClasses}>
          {this.props.footerContent}
        </div>
      </div>
    );
  }
};

global.connectedComponent = (component) => class extends Component {
  constructor() {
    super();
    this.state = {};
  }
  getWrappedInstance = () => this.refs.wrappedInstance;
  render() {
    const child = React.cloneElement(component, { ref: 'wrappedInstance' });

    return (
      <div>
        {child}
      </div>
    );
  }
};

global.shallowRender = (component) => {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
};

global.instanceRender = (component) => {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getMountedInstance(renderer);
};

global.domRender = (component) => {
  return ReactDOM.render(component, global.document.body);
};

global.noop = function() {};

// TODO: This suppresses the warnings and errors in put tests for now.
// Once the components and component tests are refactored this should be removed.
/* eslint no-console:0 */
console.warn = console.error = noop;

global.resetDOM = function() {
  global.document.head.innerHTML = '';
  global.document.body.innerHTML = '';
  global.window.zE = null;
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

global.mockObjectDifference = (a, b) => {
  const transformFn = (res, val, key) => {
    if (_.isObject(val) && _.has(b, key)) {
      const diff = mockObjectDifference(val, b[key]);

      if (!_.isEmpty(diff)) {
        res[key] = diff;
      }
    } else if (!_.isEqual(val, b[key])) {
      res[key] = val;
    }
  };

  return _.transform(a, transformFn, {});
};

global.actionSpy = (name, type) => {
  return jasmine.createSpy(name).and.returnValue({ type });
};

global.__DEV__ = true;
global.__EMBEDDABLE_VERSION__ = 'bob1337';
