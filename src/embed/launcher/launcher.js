/** @jsx React.DOM */
import { document } from 'util/globals';
module React from 'react'; /* jshint ignore:line */
import { Frame } from 'component/Frame';

require('imports?_=lodash!lodash');
var launcherCSS = require('./Launcher.scss');

var launchers = {},
    classSet = React.addons.classSet;

var Launcher = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    position: React.PropTypes.string
  },

  render: function() {
    var classes = classSet({
      'Button Button--launcher Arrange-sizeFill u-textCenter u-tableCell': true,
      'Button--launcherAlt': this.props.position === 'left'
    });

    return (
      /* jshint quotmark: false */
      <div onClick={this.props.onClick} className='Arrange Arrange--middle'>
        <div className={classes}>?</div>
      </div>
    );
  }
});

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

