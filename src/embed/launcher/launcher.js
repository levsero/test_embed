/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
import { document } from 'util/globals';
import { Launcher } from 'component/Launcher';
import { beacon   } from 'service/beacon';
import { frameFactory } from 'embed/frameFactory';

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
      base = {
        width: '80px',
        height: '50px',
        position: 'fixed',
        bottom: '10px'
      },
      posObj,
      iframeStyle,
      Embed;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  posObj = (config.position === 'left')
         ? { 'left':  '20px' }
         : { 'right': '20px' };

  iframeStyle = _.extend(base, posObj);

  Embed = React.createClass(frameFactory(
    function(params) {
      return (
        /* jshint quotmark:false */
        <Launcher
          ref='launcher'
          onClick={params.onClickHandler}
          onTouchEnd={params.onClickHandler}
          updateFrameSize={params.updateFrameSize}
          position={config.position}
          message={config.message}
          icon={config.icon} />
      );
    },
    {
      style: iframeStyle,
      css: launcherCSS,
      extend: {
        onClickHandler: function() {
          var activeState = (this.getChild().refs.launcher.state.message === '') ?
                      true :
                      false;
          config.onClick(activeState);
          beacon.track('launcher', 'click', name);
        }
      }
    }));

  launchers[name] = {
    component: <Embed />,
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
  get(name).instance.hide();
}

function show(name) {
  get(name).instance.show();
}

function changeIcon(name, icon) {
  get(name).instance.getChild().refs.launcher.changeIcon(icon);
}

function render(name) {
  if (!launchers[name]) {
    throw 'Launcher "' + name + '" does not exist or has not been created.';
  }
  var element = document.body.appendChild(document.createElement('div'));
  launchers[name].instance = React.renderComponent(launchers[name].component, element);
}

function changeMessage(name, message) {
  get(name).instance.getChild().refs.launcher.changeMessage(message);
}

function update(name) {
  var launcher = get(name).instance.getChild().refs.launcher;

  if (launcher.state.message === '') {
    changeMessage(name, 'Help');
    changeIcon(name, 'Icon');
  }
  else {
    changeMessage(name, '');
    changeIcon(name, 'Icon--cross');
  }
}

export var launcher = {
  create: create,
  list: list,
  get: get,
  render: render,
  hide: hide,
  show: show,
  changeIcon: changeIcon,
  update: update
};

