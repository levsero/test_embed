/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { document   } from 'util/globals';
import { Frame      } from 'component/Frame';
import { HelpCenter } from 'component/HelpCenter';
require('imports?_=lodash!lodash');

var helpCenterCSS = require('./helpCenter.scss'),
    helpCenters = {};

function create(name, config) {
  var base = {
        minHeight: '320px',
        borderRadius: '10px 10px 0 0',
        boxShadow: '1px 1px 5px rgba(0,0,0,0.5)',
        width: '320px',
        position: 'fixed',
        bottom: 0,
        background: 'white'
      },
      configDefaults = {
        position: 'right'
      },
      Wrapper,
      posObj,
      iframeStyle;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  posObj = (config.position === 'left')
         ? { 'left':  '20px' }
         : { 'right': '20px' };

  iframeStyle = _.extend(base, posObj);

  Wrapper = React.createClass({
    hide: function() {
      if(_.isFunction(config.onHide())) {
        config.onHide();
      }
      this.refs.frame.hide();
    },
    show: function() {
      if(_.isFunction(config.onShow())) {
        config.onShow();
      }
      this.refs.frame.show();
    },
    render: function() {
      //TODO when moving this to frame factory find a better way to set the min width and not inline
      return (
        /* jshint quotmark: false */
        <Frame ref='frame'
          visible={false}
          style={iframeStyle}
          css={helpCenterCSS}>
          <div style={{minWidth: '320px'}}>
          <div className='u-textRight u-marginVS'>
            <strong
              onClick={this.hide}
              className='u-textCTA u-isActionable'>HIDE</strong>
          </div>
          <HelpCenter ref='helpCenter' />
          </div>
        </Frame>
      );
    }
  });

  helpCenters[name] = {
    component: <Wrapper onShow={config.onShow} onHide={config.onHide} />
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
