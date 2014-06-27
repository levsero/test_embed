/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { document     } from 'util/globals';
import { SubmitTicket } from 'component/SubmitTicket';
import { frameFactory } from 'embed/frameFactory';

var submitTicketCSS = require('./submitTicket.scss'),
    submitTickets = {};

function create(name, config) {
  var containerBase = {
        minWidth: 320
      },
      base = {
        minHeight: '320px',
        borderRadius: '10px 10px 0 0',
        boxShadow: '1px 1px 5px rgba(0,0,0,0.5)',
        position: 'fixed',
        bottom: 0,
        background: 'white'
      },
      configDefaults = {
        position: 'right'
      },
      posObj,
      iframeStyle,
      Embed;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  posObj = (config.position === 'left')
         ? { 'left':  '20px' }
         : { 'right': '20px' };

  iframeStyle = _.extend(base, posObj, containerBase);

  Embed = React.createClass(frameFactory(
    (params) => {
      /* jshint quotmark:false */
      return (
        <div style={containerBase}>
          <div className='u-textRight u-marginVS'>
            <strong
              onClick={params.hideHandler}
              onTouchEnd={params.hideHandler}
              className='u-textCTA u-isActionable'>HIDE</strong>
          </div>
          <SubmitTicket
            ref='submitTicket'
            updateFrameSize={params.updateFrameSize}
            hide={params.hideHandler}
            reset={params.resetHandler} />
        </div>
      );
    },
    {
      style: iframeStyle,
      css: submitTicketCSS,
      onShow() {
        config.onShow();
      },
      onHide() {
        config.onHide();
      },
      extend: {
        hideHandler() {
          var refs = this.getChild().refs;

          this.hide();
          if (refs.submitTicket.state.showNotification) {
            this.reset();
          }
        },
        resetHandler() {
          var submitTicket = this.getChild().refs.submitTicket;

          submitTicket.setState({showNotification: false});
          submitTicket.refs.zdform.refs.form.updateValue([null]);
        }
      }
    }));

  submitTickets[name] = {
    component: <Embed visible={false} />
  };

  return this;
}

function render(name) {
  var element = document.body.appendChild(document.createElement('div'));
  submitTickets[name].instance = React.renderComponent(submitTickets[name].component, element);
}

function get(name) {
  return submitTickets[name];
}

function list() {
  return submitTickets;
}

function show(name) {
  get(name).instance.show();
}

function hide(name) {
  get(name).instance.hide();
}

function reset(name) {
  get(name).instance.reset();
}

export var submitTicket = {
  create: create,
  render: render,
  get: get,
  list: list,
  show: show,
  hide: hide,
  reset: reset
};

