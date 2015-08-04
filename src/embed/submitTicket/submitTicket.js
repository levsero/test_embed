import React from 'react/addons';

import { document,
         getDocumentHost }   from 'utility/globals';
import { SubmitTicket }      from 'component/SubmitTicket';
import { frameFactory }      from 'embed/frameFactory';
import { isMobileBrowser,
         isIE }              from 'utility/devices';
import { beacon }            from 'service/beacon';
import { mediator }          from 'service/mediator';
import { setScaleLock,
         generateUserCSS }   from 'utility/utils';

const submitTicketCSS = require('./submitTicket.scss');
let submitTickets = {};

function create(name, config) {
  let containerStyle,
      posObj;

  const iframeBase = {
    position: 'fixed',
    bottom: 0
  };
  const configDefaults = {
    position: 'right',
    customFields: [],
    hideZendeskLogo: false
  };
  const onSubmitted = function(params) {
    let ticketIdMatcher = /Request \#([0-9]+)/;
    beacon.track(
      'submitTicket',
      'send',
      name,
      {
        query: params.searchString,
        ticketId: parseInt(ticketIdMatcher.exec(params.res.body.message)[1], 10),
        locale: params.searchLocale
      }
    );
    mediator.channel.broadcast(name + '.onFormSubmitted');
  };
  const onCancel = function() {
    mediator.channel.broadcast(name + '.onCancelClick');
  };

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    posObj = (config.position === 'left')
           ? { left:  0 }
           : { right: 0 };
    iframeBase.width = 342;
    containerStyle = { width: 342, margin: 15 };
  }

  let iframeStyle = _.extend(iframeBase, posObj);

  let Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <SubmitTicket
          ref='submitTicket'
          customFields={config.customFields}
          hideZendeskLogo={config.hideZendeskLogo}
          onCancel={onCancel}
          onSubmitted={onSubmitted}
          position={config.position}
          style={containerStyle}
          updateFrameSize={params.updateFrameSize} />
      );
    },
    {
      style: iframeStyle,
      css: submitTicketCSS + generateUserCSS({color: config.color}),
      fullscreenable: true,
      onShow(child) {
        if (isMobileBrowser()) {
          setScaleLock(true);
        }
        child.refs.submitTicket.refs.submitTicketForm.resetTicketFormVisibility();
        if (!isMobileBrowser()) {
          child.refs.submitTicket.refs.submitTicketForm.focusField();
        }
      },
      name: name,
      afterShowAnimate(child) {
        if (isIE()) {
          child.refs.submitTicket.refs.submitTicketForm.focusField();
        }
      },
      onHide(child) {
        if (isMobileBrowser()) {
          setScaleLock(false);
          child.refs.submitTicket.refs.submitTicketForm.hideVirtualKeyboard();
        }
        child.refs.submitTicket.clearNotification();
      },
      onClose() {
        mediator.channel.broadcast(name + '.onClose');
      },
      onBack() {
        mediator.channel.broadcast(name + '.onBackClick');
      },
      extend: {}
    }));

  submitTickets[name] = {
    component: <Embed visible={false} />,
    config: config
  };

  return this;
}

function render(name) {
  if (submitTickets[name] && submitTickets[name].instance) {
    throw new Error(`SubmitTicket ${name} has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  submitTickets[name].instance = React.render(submitTickets[name].component, element);

  mediator.channel.subscribe(name + '.show', function() {
    submitTickets[name].instance.show();
  });

  mediator.channel.subscribe(name + '.showWithAnimation', function() {
    submitTickets[name].instance.show(true);
  });

  mediator.channel.subscribe(name + '.hide', function() {
    const submitTicket = get(name).instance.getChild().refs.submitTicket;

    submitTickets[name].instance.hide();

    if (submitTicket.state.showNotification) {
      submitTicket.clearNotification();
    }
  });

  mediator.channel.subscribe(name + '.showBackButton', function() {
    get(name).instance.getChild().setState({
      showBackButton: true
    });
  });

  mediator.channel.subscribe(name + '.setLastSearch', function(params) {
    get(name).instance.getChild().refs.submitTicket
      .setState(_.pick(params, ['searchString', 'searchLocale']));
  });

  mediator.channel.subscribe('.identify', function(user) {
    prefillForm(name, user);
  });

}

function prefillForm(name, user) {
  const getChild = get(name).instance.getChild();

  if (getChild) {
    let submitTicket = get(name).instance.getChild().refs.submitTicket;
    let submitTicketForm = submitTicket.refs.submitTicketForm;

    submitTicketForm.setState({
      formState: _.pick(user, ['name', 'email'])
    });
  } else {
    setTimeout(() => {
      prefillForm(name, user);
    }, 0);
  }
}

function get(name) {
  return submitTickets[name];
}

function list() {
  return submitTickets;
}

export var submitTicket = {
  create: create,
  render: render,
  get: get,
  list: list
};

