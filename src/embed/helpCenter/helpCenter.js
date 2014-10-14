/** @jsx React.DOM */

module React from 'react/addons';

import { document as doc } from 'utility/globals';
import { HelpCenter }      from 'component/HelpCenter';
import { frameFactory }    from 'embed/frameFactory';
import { setScaleLock }    from 'utility/utils';
import { isMobileBrowser } from 'utility/devices';
import { beacon }          from 'service/beacon';
import { i18n }            from 'service/i18n';
import { transport }       from 'service/transport';
import { mediator }        from 'service/mediator';

require('imports?_=lodash!lodash');

var helpCenterCSS = require('./helpCenter.scss'),
    helpCenters = {};

function create(name, config) {
  var containerStyle,
      iframeBase = {
        position: 'fixed',
        bottom: 50
      },
      configDefaults = {
        position: 'right'
      },
      posObj,
      iframeStyle,
      onButtonClick = function() {
        mediator.channel.broadcast(name + '.onNextClick');
      },
      onLinkClick = function(ev) {
        beacon.track('helpCenter', 'click', name, ev.target.href);
      },
      onSearch = function(searchString) {
        beacon.track('helpCenter', 'search', name, searchString);
      },
      Embed;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    posObj = (config.position === 'left')
           ? { left:  5 }
           : { right: 5 };

    iframeBase.minWidth = 400;
    containerStyle = { minWidth: 400, margin: 15 };
  }

  iframeStyle = _.extend(iframeBase, posObj);

  Embed = React.createClass(frameFactory(
    (params) => {
      return (
        /* jshint quotmark: false */
        <div style={containerStyle}>
          <HelpCenter
            ref='helpCenter'
            zendeskHost={transport.getZendeskHost()}
            onButtonClick={onButtonClick}
            onLinkClick={onLinkClick}
            onSearch={onSearch}
            updateFrameSize={params.updateFrameSize} />
        </div>
      );
    },
    {
      style: iframeStyle,
      css: helpCenterCSS,
      fullscreenable: true,
      onHide() {
        setScaleLock(false);
      },
      onShow() {
        setScaleLock(true);
        get(name).instance.getChild().refs.helpCenter.focusField();
      },
      onClose() {
        mediator.channel.broadcast(name + '.onClose');
      },
      extend: {}
    }));

  helpCenters[name] = {
    component: <Embed visible={false} />,
    config: config
  };

  return this;
}

function list() {
  return helpCenters;
}

function get(name) {
  return helpCenters[name];
}

function updateHelpCenterButton(name, labelKey) {
  /* jshint unused:false */
  var helpCenter = get(name).instance.getChild().refs.helpCenter,
      label = i18n.t(`embeddable_framework.helpCenter.submitButton.label.${labelKey}`);

  helpCenter.setState({
    buttonLabel: label
  });
}

function render(name) {
  if (helpCenters[name] && helpCenters[name].instance) {
    throw new Error(`HelpCenter ${name} has already been rendered.`);
  }

  var element = doc.body.appendChild(doc.createElement('div'));
  helpCenters[name].instance = React.renderComponent(helpCenters[name].component, element);

  mediator.channel.subscribe(name + '.show', function() {
    get(name).instance.show();
  });

  mediator.channel.subscribe(name + '.hide', function() {
    get(name).instance.hide();
  });

  mediator.channel.subscribe(name + '.setNextToChat', function() {
    updateHelpCenterButton(name, 'chat');
  });

  mediator.channel.subscribe(name + '.setNextToSubmitTicket', function() {
    updateHelpCenterButton(name, 'submitTicket');
  });

}

export var helpCenter = {
  create: create,
  list: list,
  get: get,
  render: render
};
