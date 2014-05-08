/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
import { Frame } from 'Frame';

var _ = require('lodash');
var launcherCSS = require('components/Button.css');

var launchers = {},
    classSet = React.addons.classSet;

var Launcher = React.createClass({
  render: function() {
    var base = {
        border: 'none',
        height: '50px',
        width: '50px',
        position: 'fixed',
        bottom: '10px'
    },
    iframeStyle,
    posObj,
    position = this.props.position;

    var classes = classSet({
      'Button Button--launcher Arrange-sizeFill u-textCenter u-tableCell': true,
      'Button--launcherAlt': position === 'left'
    });

    if(position === 'left') {
      posObj = {
        'left': '20px'
      };
    } else {
      posObj = {
        'right': '20px'
      };
    }

    iframeStyle = _.extend(base, posObj);

    return (
      /* jshint quotmark: false */
      <Frame style={iframeStyle}>
        <div>
          <style>{launcherCSS}</style>
          <div onClick={this.props.onClick} className='Arrange Arrange--middle'>
            <div className={classes}>?</div>
          </div>
        </div>
      </Frame>
    );
  }
});

function create(name, config) {
  var configDefaults = {
    onClick: function() {},
    position: 'right'
  };
  config = _.extend(configDefaults, config);

  launchers[name] = <Launcher name={name} onClick={config.onClick} position={config.position} />;
}

function list() {
  return launchers;
}

function get(name) {
  return launchers[name];
}

function render(name) {
  var el = document.body.appendChild(document.createElement('div'));
  React.renderComponent(launchers[name], el);
}

export var launcher = {
  create: create,
  list: list,
  render: render,
  get: get
};

