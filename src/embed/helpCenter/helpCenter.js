/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { document     } from 'utility/globals';
import { frameFactory } from 'embed/frameFactory';
import { HelpCenter   } from 'component/HelpCenter';
require('imports?_=lodash!lodash');

var helpCenterCSS = require('./helpCenter.scss'),
    helpCenters = {};

function create(name, config) {
  var base = {
        minHeight: 320,
        borderRadius: '10px 10px 0 0',
        boxShadow: '1px 1px 5px rgba(0,0,0,0.5)',
        position: 'fixed',
        bottom: 0,
        background: 'white'
      },
      containerBase = {
        minWidth: 320
      },
      configDefaults = {
        position: 'right'
      },
      Embed,
      posObj,
      iframeStyle;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  posObj = (config.position === 'left')
         ? { left:  '20px' }
         : { right: '20px' };

  iframeStyle = _.extend(base, posObj, containerBase);

  Embed = React.createClass(frameFactory(
    (params) => {
      return (
        /* jshint quotmark: false */
        <div style={containerBase}>
          <div className='u-textRight u-marginVS'>
            <strong
              ref='hideButton'
              onClick={params.hideHandler}
              onTouchEnd={params.hideHandler}
              className='u-textCTA u-isActionable'>HIDE</strong>
          </div>
          <HelpCenter ref='helpCenter' />
        </div>
      );
    },
    {
      style: iframeStyle,
      css: helpCenterCSS,
      onHide() {
        config.onHide();
      },
      onShow() {
        config.onShow();
      },
      extend: {
        hideHandler() {
          this.hide();
        }
      }
    }
  ));

  helpCenters[name] = {
    component: <Embed visible={false} />
  };

  return this;
}

function list() {
  return helpCenters;
}

function get(name) {
  return helpCenters[name];
}

function show(name) {
  get(name).instance.show();
}

function hide(name) {
  get(name).instance.hide();
}

function render(name) {
  if (!helpCenters[name]) {
    throw 'HelpCenter "' + name + '" does not exist or has not been created.';
  }

  var element = document.body.appendChild(document.createElement('div'));
  helpCenters[name].instance = React.renderComponent(helpCenters[name].component, element);
}

export var helpCenter = {
  create: create,
  list: list,
  get: get,
  show: show,
  hide: hide,
  render: render
};
