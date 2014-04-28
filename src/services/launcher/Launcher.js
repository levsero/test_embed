/** @jsx React.DOM */
import { _ } from 'lodash';
module React from 'react';
import { Frame } from './Frame.js';

var launchers = {};

var Launcher = React.createClass({
  render: function() {
      var iframeStyle = {
          border: 'none',
          height: '50px',
          width: '50px',
          position: 'fixed',
          bottom: '10px',
          right: '20px'
      };

    return (
      <Frame style={iframeStyle}>
        <div onClick={this.props.onClick} className="Launcher--default">
          <div>?</div>
        </div>
      </Frame>
    );
  }
});

function create(name, config) {
  launchers[name] = <Launcher name={name} onClick={config.onClick} />;
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

