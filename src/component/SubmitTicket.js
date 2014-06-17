/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
import { win                } from 'util/globals';
import { identity           } from 'service/identity';
import { transport          } from 'service/transport';
import { ZdForm             } from 'component/ZdForm';
import { submitTicketSchema } from 'component/SubmitTicketSchema';
require('imports?_=lodash!lodash');


export var SubmitTicket = React.createClass({
  getInitialState: function() {
    return {
      showNotification: false,
      message: '',
      uid: _.uniqueId('submitTicketForm_')
    };
  },

  handleSubmit(e, data) {
    e.preventDefault();

    if(data.isFormInvalid) {
      console.log('invalid form');
      return;
    }

    var tags = ['buid-' + identity.getBuid(), 'DROPBOX'].join(' '),
        formParams = {
          'set_tags': tags,
          'submitted_from': win.location.href
        },
        payload = {
          method: 'post',
          path: '/api/ticket_submission',
          params: _.extend(formParams, data.value),
          callbacks: {
            done: function() {
              this.setState({
                showNotification: true,
                message: 'Ticket Submitted! Thanks!'
              });
            }.bind(this),
            fail: function(data, status) {
              this.setState({
                showNotification: true,
                message: 'Error ' + status + ': ' + JSON.parse(data).error
              });
            }.bind(this)
          }
        };

    transport.send(payload);
  },

  render: function() {
    var formVisibility = (this.state.showNotification) ? 'u-isHidden' : '',
        notifyVisibility = (formVisibility) ?  '' : 'u-isHidden';

    return (
      /* jshint quotmark:false */
      <div className='Container u-nbfc u-posRelative' key={this.state.uid}>
        <div className={"Notify " + notifyVisibility}>
          <div className="Notify-body Notify-body--success">
            <h1 className="Notify-title u-textCenter">{this.state.message}</h1>
          </div>
        </div>
        <ZdForm
          className={formVisibility}
          schema={submitTicketSchema}
          submit={this.handleSubmit}
        />
      </div>
    );
  }
});
