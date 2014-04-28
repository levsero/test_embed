/** @jsx React.DOM */
import { _ } from 'lodash';
module React from 'react';
import { Frame } from '../../components/Frame.js';

var launchers = {};

var Launcher = React.createClass({
  render: function() {
      var base = {
          border: 'none',
          height: '50px',
          width: '50px',
          position: 'fixed',
          bottom: '10px'
      };
      var iframeStyle,
          className;

      if (this.props.position === "left") {
          iframeStyle = _.extend(base, {
              left: '20px'
          });
          className = "Launcher Launcher--left";
      }
      else {
          iframeStyle = _.extend(base, {
              right: '20px'
          });
          className = "Launcher";
      }

    return (
      <Frame style={iframeStyle}>
        <div onClick={this.props.onClick} className={className}>
          <div>?</div>
        </div>
      </Frame>
    );
  }
});

function create(name, config) {
  launchers[name] = <Launcher name={name} onClick={config.onClick} position={config.position} />;
}

function list() {
  return launchers;
}

function listKeys() {
  return _.keys(launchers);
}

function get(name) {
  return launchers[name];
}

function render(name) {
  var el = document.body.appendChild(document.createElement('div'));
  var iframe;
  React.renderComponent(launchers[name], el);
}

export var launcher = {
  create: create,
  list: list,
  listKeys: listKeys,
  render: render,
  get: get
};

