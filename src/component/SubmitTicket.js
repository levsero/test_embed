/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
import { win                } from 'util/globals';
import { identity           } from 'service/identity';
import { transport          } from 'service/transport';
import { ZdForm             } from 'component/ZdForm';
import { submitTicketSchema } from 'component/SubmitTicketSchema';
require('imports?_=lodash!lodash');

export var SubmitTicket = React.createClass({
  propTypes: {
    hide: React.PropTypes.func.isRequired,
    reset: React.PropTypes.func.isRequired
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
    this.props.reset();

    e.preventDefault();
  },

  handleSubmit(e, data) {
    e.preventDefault();

    if(data.isFormInvalid) {
      // TODO: Handle invalid form submission
      return;
    }

    var tags = ['buid-' + identity.getBuid(), 'DROPBOX'].join(' '),
        formParams = _.extend({
          'set_tags': tags,
          'submitted_from': win.location.href
        }, data.value),
        resCallback = (msg) => {
          this.setState({
            showNotification: true,
            message: msg
          });
        },
        payload = {
          method: 'post',
          path: '/api/ticket_submission',
          params: formParams,
          callbacks: {
            done() {
              resCallback('Ticket Submitted! Thanks!');
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

    return (
      /* jshint quotmark:false */
      <div className='Container u-nbfc u-posRelative' key={this.state.uid}>
        <div className={"Notify " + notifyVisibility}>
          <div className="Notify-body Notify-body--success">
            <h1 className="Notify-title u-textCenter">{this.state.message}</h1>
          </div>
        </div>
        <ZdForm
          ref='zdform'
          className={formVisibility}
          schema={submitTicketSchema}
          submit={this.handleSubmit}>
          <div className='Arrange Arrange--middle'>
            <strong
              onClick={this.handleCancel}
              onTouchEnd={this.handleCancel}
              className='Arrange-sizeFill u-isActionable u-textSecondary'>
                Cancel
            </strong>
            <input
              type='submit'
              value='Submit Ticket'
              className='Button Button--default Button--cta Arrange-sizeFit u-textNoWrap'
            />
          </div>
        </ZdForm>

      </div>
    );
  }
});
