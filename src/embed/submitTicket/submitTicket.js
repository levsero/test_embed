/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { document     } from 'util/globals';
import { Frame        } from 'component/Frame';
import { SubmitTicket } from 'component/SubmitTicket';

var submitTicketCSS = require('./submitTicket.scss'),
    submitTickets = {};

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
    show() {
      if(_.isFunction(config.onShow())) {
        config.onShow();
      }
      this.refs.frame.show();
    },

    hide() {
      var refs = this.refs;

      if(_.isFunction(config.onHide())) {
        config.onHide();
      }
      refs.frame.hide();
      if (refs.submitTicket.state.showNotification) {
        this.reset();
      }
    },

    reset() {
      var submitTicket = this.refs.submitTicket;

      submitTicket.setState({showNotification: false});
      submitTicket.refs.zdform.refs.form.updateValue([null]);
    },

    render() {
      return (
        /* jshint quotmark: false */
        <Frame ref='frame'
          visible={false}
          style={iframeStyle}
          css={submitTicketCSS}>
          <div className='u-textRight u-marginVS'>
            <strong
              onClick={this.hide}
              onTouchEnd={this.hide}
              className='u-textCTA u-isActionable'>HIDE</strong>
          </div>
          <SubmitTicket
            ref='submitTicket'
            hide={this.hide}
            reset={this.reset} />
        </Frame>
      );
    }
  });

  submitTickets[name] = {
    component: <Wrapper />
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

