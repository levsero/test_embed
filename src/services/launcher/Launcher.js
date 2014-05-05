/** @jsx React.DOM */
import { _ } from 'lodash';
module React from 'react'; /* jshint ignore:line */
import { Frame } from '../../components/Frame.js';
import { document } from '../../utils/utils';

var launchers = {};

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
    className;

    if (this.props.position === 'left') {
      iframeStyle = _.extend(base, {
        left: '20px'
      });
      className = 'Launcher Launcher--left';
    }
    else {
      iframeStyle = _.extend(base, {
        right: '20px'
      });
      className = 'Launcher';
    }


    return (
      <Frame style={iframeStyle}>
        <div onClick={this.props.onClick} className={className}>
          <div>?</div>{/* jshint ignore:line */}
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

