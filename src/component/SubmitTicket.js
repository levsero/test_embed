/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
import { win                } from 'util/globals';
import { transport          } from 'service/transport';
import { SubmitTicketForm   } from 'component/SubmitTicketForm';
import { getSizingRatio, isMobileBrowser } from 'util/devices';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet;

export var SubmitTicket = React.createClass({
  getInitialState() {
    return {
      showNotification: false,
      message: '',
      fullscreen: getSizingRatio() > 1 && isMobileBrowser(),
      uid: _.uniqueId('submitTicketForm_')
    };
  },

  reset() {
    this.setState({showNotification: false});
    this.refs.submitTicketForm.refs.form.updateValue([null]);
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
          this.props.updateFrameSize(0,0);
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
        containerClasses = classSet({
          'Container': true,
          'Container--popover': !this.state.fullscreen,
          'Container--fullscreen': this.state.fullscreen,
          'u-nbfcAlt': true,
          'u-posRelative': true
        }),
        logoClasses = classSet({
          'Icon': true,
          'Icon--zendesk': true,
          'u-linkClean': true,
          'u-posAbsolute': !this.state.fullscreen,
          'u-posStart': !this.state.fullscreen
        });

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(0, 10), 0);
    }

    return (
      /* jshint quotmark:false */
      <div
        className={containerClasses}
        key={this.state.uid}>
        <div className={"Notify u-textCenter " + notifyVisibility }>
          <div className='Icon Icon--tick u-inlineBlock' />
          <div className='u-textBold'>{this.state.message}</div>
        </div>
        <SubmitTicketForm
          fullscreen={this.state.fullscreen}
          ref='submitTicketForm'
          className={formVisibility}
          submit={this.handleSubmit} />
        <div className='u-nbfc'>
          <a
            href={'http://www.zendesk.com/?utm_medium=cetoolkit&utm_campaign=embeddables'}
            target='_blank'
            className={logoClasses}>
            <span className='u-isHiddenVisually'>zendesk</span>
          </a>
        </div>
      </div>
    );
  }
});
