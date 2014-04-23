/** @jsx React.DOM */
import { _ } from 'lodash';
module React from 'react';

var launchers = {};

var Launcher = React.createClass({
  wrapperStyle: function() {
    var base = {
      position:"fixed",
      width:"auto",
      height:"auto",
      background:"#0a8",
      textAlign:"center",
      color:"#fff",
      padding:"6px 20px",
      fontFamily:"sans-serif",
      fontSize:"12px",
      borderRadius: "8px 8px 0 0",
      cursor: "pointer",
    };

    switch(this.props.position) {

      case 'bottom-left':
        return _.extend(base, {
          right: null,
          left: "50px",
          bottom: "0px"
        });
      break

      case 'side-left':
        return _.extend(base, {
          right: null,
          left: "0px",
          bottom: "400px",
          transform: "rotate(90deg)",
          transformOrigin: "0% 100%"
        });
      break;

      case 'side-right':
        return _.extend(base, {
          right: "0px",
          left: null,
          bottom: "400px",
          transform: "rotate(-90deg)",
          transformOrigin: "100% 100%"
        });
      break;

      case 'bottom-right':
      default:
        return _.extend(base, {
          right: "50px",
          left: null,
          bottom: "0px"
        });
      break;
    }
  },

  textStyle: function() {
    if (0 && _.any(['side-left', 'side-right'], function(el) { return this.props.position == el;}.bind(this))) {
      return {
        transform: "rotate(90deg)"
      };
    }
    else {
      return {};
    }
  },

  render: function() {
    return (
      <div onClick={this.props.onClick} 
           style={this.wrapperStyle()}>
        <div style={this.textStyle()}>Hello, my name is {this.props.name}.</div>
      </div>
    );
  }
});

function create(name, position, callback) {
  launchers[name] = <Launcher name={name} onClick={callback} position={position} />;
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
  React.renderComponent(launchers[name], el);
}

export var launcher = {
  create: create,
  list: list,
  listKeys: listKeys,
  render: render,
  get: get
};

