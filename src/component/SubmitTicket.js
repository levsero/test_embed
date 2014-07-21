/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
import { win                } from 'util/globals';
import { transport          } from 'service/transport';
import { SubmitTicketForm   } from 'component/SubmitTicketForm';
require('imports?_=lodash!lodash');

export var SubmitTicket = React.createClass({
  propTypes: {
    hide: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      showNotification: false,
      message: '',
      uid: _.uniqueId('submitTicketForm_')
    };
  },

  handleCancel(e) {
    this.props.hide();
    this.reset();

    e.preventDefault();
  },

  reset() {
    this.setState({showNotification: false});
    this.refs.zdform.refs.form.updateValue([null]);
  },

  showField: function() {
    this.setState({showEmail: true});
  },

  handleSubmit(e, data) {
    e.preventDefault();

    if(data.isFormInvalid) {
      // TODO: Handle invalid form submission
      return;
    }

    var tags = ['DROPBOX', 'CEToolkit'].join(' '),
        formParams = _.extend({
          'set_tags': tags,
          'submitted_from': win.location.href
        }, data.value),
        resCallback = (msg) => {
          this.setState({
            showNotification: true,
            message: msg
          });
          this.props.updateFrameSize();
        },
        payload = {
          method: 'post',
          path: '/api/ticket_submission',
          params: formParams,
          callbacks: {
            done() {
              resCallback('Message sent');
            },
            fail(data, status) {
              resCallback('Error ' + status + ': ' + JSON.parse(data).error);
            }
          }
        };

    transport.send(payload);
  },

  render() {
    var formVisibility = (this.state.showNotification) ? 'u-isHidden' : '',
        notifyVisibility = (formVisibility) ?  '' : 'u-isHidden';

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(0, 10), 0);
    }

    return (
      /* jshint quotmark:false */
      <div
        className='Container Container--popover u-nbfcAlt u-posRelative'
        key={this.state.uid}>
        <div className={"Notify u-textCenter " + notifyVisibility }>
          <div className='Icon Icon--tick u-inlineBlock' />
          <div className='u-textBold'>{this.state.message}</div>
        </div>
        <SubmitTicketForm
          ref='submitTicketForm'
          className={formVisibility}
          submit={this.handleSubmit} />
        <a
          href='http://www.zendesk.com/?utm_medium=cetoolkit&utm_campaign=embeddables'
          target='_blank'
          className='Icon Icon--zendesk u-posAbsolute u-posStart'>
          <span className='u-isHiddenVisually'>zendesk</span>
        </a>
      </div>
    );
  }
});
