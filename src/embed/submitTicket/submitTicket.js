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
    getInitialState() {
      return {
        name: name
      };
    },
    hide() {
      this.props.onHide();
      hide(this.state.name);
    },
    resetForm() {
      this.hide();
      reset(this.state.name);
    },
    show() {
      this.props.onShow();
      this.refs.frame.show();
    },
    render() {
      var classes = this.props.closable ? '' : 'u-isHidden';

      return (
        /* jshint quotmark: false */
        <Frame ref='frame'
          visibility={false}
          closable={true}
          style={iframeStyle}
          css={submitTicketCSS}>
          <div className={classes + ' u-textRight u-marginVS'}>
            <strong
              onClick={this.hide}
              className='u-textCTA u-isActionable'>HIDE</strong>
          </div>
          <SubmitTicket ref='submitTicket' reset={this.resetForm} />
        </Frame>
      );
    }
  });

  submitTickets[name] = {
    component: (
      <Wrapper
        onShow={config.onShow}
        onHide={config.onHide}
        closable={true} />
      )
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
  var refs = get(name).instance.refs;

  refs.frame.hide();
  if (refs.submitTicket.state.showNotification) {
    reset(name);
  }
}

function reset(name) {
  var refs = get(name).instance.refs,
      submitTicket = refs.submitTicket,
      reactForm = submitTicket.refs.zdform.refs.form;

  submitTicket.setState({showNotification: false});
  reactForm.updateValue([null]);
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

