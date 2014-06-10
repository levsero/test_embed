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
        onClick: function() {},
        position: 'right'
      },
      onClickHandler,
      base = {
        height: '30px',
        width: '80px',
        position: 'fixed',
        bottom: '10px'
      },
      posObj,
      iframeStyle,
      visibility = true;

  config = _.extend(configDefaults, config);

  onClickHandler = function() {
    hide(name);
    config.onClick();
    beacon.track('launcher', 'click', name);
  };

  /* jshint laxbreak: true */
  posObj = (config.position === 'left')
         ? { 'left':  '20px' }
         : { 'right': '20px' };

  iframeStyle = _.extend(base, posObj);
  launchers[name] = {
    component: (
      <Frame style={iframeStyle} css={launcherCSS} visibility={visibility}>
        <Launcher
          onClick={onClickHandler}
          onTouchEnd={onClickHandler}
          position={config.position} />
      </Frame>
    ),
    config: config
  };
}

function list() {
  return launchers;
}

function get(name) {
  return launchers[name];
}

function hide(name) {
  get(name).component.setState({show: false});
}

function show(name) {
  get(name).component.setState({show: true});
}

function render(name) {
  if (!launchers[name]) {
    throw 'Launcher "' + name + '" does not exist or has not been created.';
  }
  var element = document.body.appendChild(document.createElement('div'));
  React.renderComponent(launchers[name].component, element);
}

export var launcher = {
  create: create,
  list: list,
  get: get,
  render: render,
  hide: hide,
  show: show
};

