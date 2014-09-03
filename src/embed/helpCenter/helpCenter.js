/** @jsx React.DOM */

module React from 'react/addons';

import { document }        from 'utility/globals';
import { frameFactory }    from 'embed/frameFactory';
import { HelpCenter }      from 'component/HelpCenter';
import { setScaleLock }    from 'utility/utils';
import { isMobileBrowser } from 'utility/devices';

require('imports?_=lodash!lodash');

var helpCenterCSS = require('./helpCenter.scss'),
    helpCenters = {};

function create(name, config) {
  var containerStyle,
      iframeBase = {
        position: 'fixed',
        bottom: 48
      },
      configDefaults = {
        position: 'right'
      },
      posObj,
      iframeStyle,
      Embed;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    posObj = (config.position === 'left')
      ? { left:  5 }
      : { right: 5 };
    iframeBase.minWidth = 350;
    containerStyle = { minWidth: 350, margin: 15 };
  }

  iframeStyle = _.extend(iframeBase, posObj);


  Embed = React.createClass(frameFactory(
    (params) => {
      return (
        /* jshint quotmark: false */
        <div style={containerStyle}>
          <HelpCenter
            ref='helpCenter'
            updateFrameSize={params.updateFrameSize} />
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
      onClose() {
        update(name, true);
      },
      extend: {}
    }));

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

function update(name, isVisible) {
  if (isVisible) {
    hide(name);
  } else {
    show(name);
  }
}

function render(name) {
  if (helpCenters[name] && helpCenters[name].instance) {
    throw new Error(`HelpCenter ${name} has already been rendered.`);
  }

  console.log(document.body);
  var element = document.body.appendChild(document.createElement('div'));
  helpCenters[name].instance = React.renderComponent(helpCenters[name].component, element);
}

export var helpCenter = {
  create: create,
  list: list,
  get: get,
  show: show,
  hide: hide,
  update: update,
  render: render
};
