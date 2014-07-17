/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
import { win                } from 'util/globals';
import { identity           } from 'service/identity';
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
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    return (
      /* jshint quotmark:false */
      <div className='Container u-nbfc u-posRelative' key={this.state.uid}>
        <div className={"Notify " + notifyVisibility}>
          <div className="Notify-body Notify-body--success">
            <div className="Notify-title u-textCenter">
              <div className='u-textSizeLrg'>
                &#x2713;
              </div>
              {this.state.message}
            </div>
          </div>
        </div>
        <SubmitTicketForm
          ref='submitTicketForm'
          className={formVisibility}
          submit={this.handleSubmit} />
        <a
          href='https://www.zendesk.com'
          target='_blank'
          className='u-posAbsolute u-posStart u-posEnd--vert'>
            zendesk
        </a>
      </div>
    );
  }
});
