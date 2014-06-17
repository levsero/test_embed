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

  /* jshint laxbreak: true */
  posObj = (config.position === 'left')
         ? { 'left':  '20px' }
         : { 'right': '20px' };

  iframeStyle = _.extend(base, posObj);

  Wrapper = React.createClass({
    getInitialState: function() {
      return ({
        iframeDimensions: {
          height: 0,
          width: 0
        }
      });
    },
    onClickHandler: function() {
      config.onClick();
      beacon.track('launcher', 'click', name);
    },
    updateFrameSize: function() {
      var win = this.refs.frame.getDOMNode().contentWindow,
          dimensions;

      if (!win.document.getElementsByTagName('div')[0]) {
       return false;
      }

      dimensions = function() {
        var element = win.document.getElementsByTagName('div');
        return ({
          width:  Math.max(element.clientWidth,  element.offsetWidth),
          height: Math.max(element.clientHeight, element.offsetHeight)
        });
      };

      this.setState({iframeDimensions: dimensions()});
    },
    hide: function() {
      this.refs.frame.hide();
    },
    show: function() {
      this.refs.frame.show();
    },
    changeIcon: function(icon) {
      this.refs.launcher.changeIcon(icon);
    },
    render: function() {
      return (
        /* jshint quotmark: true */
        <Frame ref='frame'
          style={iframeStyle}
          css={launcherCSS}>
          <Launcher
            ref='launcher'
            onClick={this.onClickHandler}
            onTouchEnd={this.onClickHandler}
            updateFrameSize={this.updateFrameSize}
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
  get(name).instance.hide();
}

function show(name) {
  get(name).instance.show();
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

