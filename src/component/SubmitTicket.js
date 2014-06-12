/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { win           } from 'util/globals';
import { identity      } from 'service/identity';
import { TextAreaInput } from 'component/TextAreaInput';
import { TextInput     } from 'component/TextInput';
import { transport     } from 'service/transport';
import { validation    } from 'mixin/validation';
require('imports?_=lodash!lodash');

export var SubmitTicket = React.createClass({
  getInitialState: function() {
    return {
      showNotification: false,
      message: '',
      showEmail: false,
      uid: _.uniqueId('submitTicketForm_')
    };
  },

  showField: function() {
    this.setState({showEmail: true});
  },

  handleSubmit: function(e) {
    var refs = this.refs,
        tags = ['buid-' + identity.getBuid() , 'DROPBOX'].join(' '),
        formParams = {
          'email': refs.emailField.refs.inputText.getDOMNode().value,
          'description': refs.descriptionField.refs.inputText.getDOMNode().value,
          'set_tags': tags,
          'submitted_from': win.location.href
        },
        errors = _.union(
          refs.emailField.state.errors,
          refs.descriptionField.state.errors
        );

    e.preventDefault();
    if (errors.length !== 0) {
      return;
    }
    var form = this;
    var payload = {
      method: 'POST',
      path: '/api/ticket_submission',
      params: formParams,
      callbacks: {
        done: function() {
          form.setState({
            showNotification: true,
            message: 'Ticket Submitted! Thanks!'
          });
        },
        fail: function(data, status) {
          form.setState({
            showNotification: true,
            message: 'Error ' + status + ': ' + JSON.parse(data).error
          });
        }
      }
    };
    transport.send(payload);
  },
  render: function() {
    var notifyVisibility = (this.state.showNotification) ?  '' : 'u-isHidden';
    var formVisibility = (this.state.showNotification) ? 'u-isHidden' : '';
    var emailVisibility = (this.state.showEmail) ? 'FadeIn--active' : '';

    return (
      /* jshint quotmark:false */
      <div className='Container u-nbfc u-posRelative' key={this.state.uid}>
        <div className={"Notify " + notifyVisibility}>
          <div className="Notify-body Notify-body--success">
            <h1 className="Notify-title u-textCenter">{this.state.message}</h1>
          </div>
        </div>
        <div className={'Form ' + formVisibility}>
          <div className='Form-container u-nbfc'>
            <form onSubmit={this.handleSubmit}>
              <div className='Grid'>
                <TextAreaInput
                  ref='descriptionField'
                  validate={validation.baseValidation}
                  className='Grid-cell Form-field'
                  showField={this.showField}
                />
              </div>
              <div className='Grid'>
                <TextInput
                  ref='emailField'
                  name='Email'
                  validate={validation.emailValidation}
                  className={'Grid-cell Form-field FadeIn ' + emailVisibility}
                />
              </div>
              <input
                type='submit'
                className='Button Button--default u-pullRight'
              />
            </form>
         </div>
        </div>
      </div>
    );
  }
});
