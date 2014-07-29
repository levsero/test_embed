/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
import { win                } from 'util/globals';
import { transport          } from 'service/transport';
import { SubmitTicketForm   } from 'component/SubmitTicketForm';
require('imports?_=lodash!lodash');

export var SubmitTicket = React.createClass({
  getInitialState() {
    return {
      showNotification: false,
      message: '',
      uid: _.uniqueId('submitTicketForm_')
    };
  },

  reset() {
    var submitTicketForm = this.refs.submitTicketForm;

    this.setState({showNotification: false});
    submitTicketForm.refs.form.updateValue([null]);
    submitTicketForm.setState({
      buttonMessage: 'Send',
      isSubmitting: false,
      isValid: false
    });
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
          'via_id': 17,
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
        notifyVisibility = (formVisibility) ?  '' : 'u-isHidden',
        logoUrl = ['//www.zendesk.com/lp/just-one-click/',
                   '?utm_source=launcher&utm_medium=poweredbyzendesk&utm_campaign=image'
                  ].join('');

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
          href={logoUrl}
          target='_blank'
          className='Icon Icon--zendesk u-linkClean u-posAbsolute u-posStart'>
          <span className='u-isHiddenVisually'>zendesk</span>
        </a>
      </div>
    );
  }
});
