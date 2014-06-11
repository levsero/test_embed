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
        position: 'right',
        message: 'Help',
        icon: ''
      },
      onClickHandler,
      base = {
        width: '80px',
        height: '50px',
        position: 'fixed',
        bottom: '10px'
      },
      posObj,
      iframeStyle,
      Wrapper;

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

  Wrapper = React.createClass({
    toggleVisibility: function() {
      this.refs.frame.toggleVisibility();
    },
    changeIcon: function(icon) {
      this.refs.launcher.changeIcon(icon);
    },
    render: function() {
      var show = true;
      return (
        /* jshint quotmark: true */
        <Frame ref='frame'
          style={iframeStyle}
          css={launcherCSS}
          visibility={show}>
          <Launcher
            ref='launcher'
            onClick={onClickHandler}
            onTouchEnd={onClickHandler}
            position={config.position}
            message={config.message}
            icon={config.icon}
          />
        </Frame>
      );
    }
  });

  launchers[name] = {
    component: <Wrapper />,
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
  get(name).instance.toggleVisibility();
}

function show(name) {
  get(name).instance.toggleVisibility();
}

function changeIcon(name, icon) {
  get(name).instance.changeIcon(icon);
}

function render(name) {
  if (!launchers[name]) {
    throw 'Launcher "' + name + '" does not exist or has not been created.';
  }
  var element = document.body.appendChild(document.createElement('div'));
  launchers[name].instance = React.renderComponent(launchers[name].component, element);
}

export var launcher = {
  create: create,
  list: list,
  get: get,
  render: render,
  hide: hide,
  show: show,
  changeIcon: changeIcon
};

