/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
module ReactForms from 'react-forms';
import { win                } from 'util/globals';
import { identity           } from 'service/identity';
import { transport          } from 'service/transport';
import { ZdForm, EmailField } from 'component/ZdForm';
require('imports?_=lodash!lodash');

var { Schema, Property } = ReactForms.schema;

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
    var submitTicketSchema = (
      /* jshint quotmark:false */
      <Schema>
        <Property
          name='description'
          label='Message'
          ref='message'
          required
          input={<textarea rows='5' placeholder='Give us details here...' />}
        />
        <EmailField required />
      </Schema>
    );
    var formVisibility = (this.state.showNotification) ? 'u-isHidden' : '';
    var notifyVisibility = (formVisibility) ?  '' : 'u-isHidden';

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
