/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
import { document } from 'util/globals';
import { Frame    } from 'component/Frame';
import { Launcher } from 'component/Launcher';
import { beacon   } from 'service/beacon';
require('imports?_=lodash!lodash');

var launcherCSS = require('./launcher.scss'),
    launchers = {};

function create(name, config) {
  var configDefaults = {
        onClick: _.noop,
        position: 'right'
      },
      onClickHandler;
  
  config = _.extend(configDefaults, config);

  onClickHandler = function() {
    config.onClick();
    beacon.track('launcher', 'click', name);
  };

  launchers[name] = {
    component: <Launcher onClick={onClickHandler} position={config.position} />,
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
  if(!launchers[name]) {
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

  /* jshint laxbreak: true */
  posObj = (config.position === 'left')
         ? { 'left':  '20px' }
         : { 'right': '20px' };

  var iframeStyle = _.extend(base, posObj),
      element = document.body.appendChild(document.createElement('div')),
      component = (
        <Frame style={iframeStyle} css={launcherCSS}>
          {launchers[name].component}
        </Frame>
      );

  React.renderComponent(component, element);
}

export var launcher = {
  create: create,
  list: list,
  get: get,
  render: render
};

