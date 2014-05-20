/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
import { document } from 'util/globals';
import { Frame    } from 'component/Frame';
import { Launcher } from 'component/Launcher';
require('imports?_=lodash!lodash');

var launcherCSS = require('./launcher.scss'),
    launchers = {};

function create(name, config) {
  var configDefaults = {
    onClick: function() {},
    position: 'right'
  };

  config = _.extend(configDefaults, config);

  launchers[name] = {
    component: <Launcher onClick={config.onClick} position={config.position} />,
    config: config
  };
}

function list() {
  return launchers;
}

function get(name) {
  return launchers[name];
}

function render(name) {
  if (!launchers[name]) {
    throw 'Launcher "' + name + '" does not exist or has not been created.';
  }
  var base = {
        height: '50px',
        width: '50px',
        position: 'fixed',
        bottom: '10px'
      },
      config = launchers[name].config,
      posObj;

  if(config.position === 'left') {
    posObj = {
      'left': '20px'
    };
  } else {
    posObj = {
      'right': '20px'
    };
  }

  var iframeStyle = _.extend(base, posObj),
      element = document.body.appendChild(document.createElement('div')),
      component = (
        /* jshint quotmark:false */
        <Frame style={iframeStyle} css={launcherCSS}>
          {launchers[name].component}
        </Frame>
      );

  React.renderComponent(component, element);
}

export var launcher = {
  create: create,
  list: list,
  render: render,
  get: get
};

