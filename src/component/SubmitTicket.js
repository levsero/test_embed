/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
import { win              } from 'utility/globals';
import { transport        } from 'service/transport';
import { SubmitTicketForm } from 'component/SubmitTicketForm';
import { isMobileBrowser  } from 'utility/devices';
import { i18n             } from  'service/i18n';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet;

export var SubmitTicket = React.createClass({
  getInitialState() {
    return {
      showNotification: false,
      message: '',
      fullscreen: isMobileBrowser(),
      uid: _.uniqueId('submitTicketForm_')
    };
  },

  reset() {
    var submitTicketForm = this.refs.submitTicketForm;

    this.setState({showNotification: false});
    submitTicketForm.refs.form.updateValue([null]);
    submitTicketForm.setState(submitTicketForm.getInitialState());
  },

  showField: function() {
    this.setState({showEmail: true});
  },

  handleSubmit(e, data) {
    e.preventDefault();

    if (data.isFormInvalid) {
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
              resCallback(i18n.translate('submitTicket.success.header'));
            },
            fail(data, status) {
              resCallback(i18n.translate('submitTicket.error.message', {
                status: status,
                errorMsg: JSON.parse(data).error
              }));
            }
          }
        };

    transport.send(payload);
  },

  render() {
    var formClasses = classSet({
          'u-isHidden': this.state.showNotification
        }),
        containerClasses = classSet({
          'Container': true,
          'Container--popover u-nbfcAlt': !this.state.fullscreen,
          'Container--fullscreen': this.state.fullscreen,
          'Arrange Arrange--middle': this.state.fullscreen,
          'u-posRelative': true
        }),
        logoClasses = classSet({
          'Icon Icon--zendesk u-linkClean': true,
          'u-posAbsolute': !this.state.fullscreen || this.state.showNotification,
          'u-posStart u-posEnd--vert': !this.state.fullscreen || this.state.showNotification,
        }),
        notifyClasses = classSet({
          'Notify': true,
          'u-textCenter': true,
          'Arrange-sizeFill': this.state.fullscreen,
          'u-isHidden': !this.state.showNotification
        }),
        logoUrl = ['//www.zendesk.com/lp/just-one-click/',
                   '?utm_source=launcher&utm_medium=poweredbyzendesk&utm_campaign=image'
                  ].join(''),
        marketingUrl = ['//www.zendesk.com/lp/just-one-click/',
                        '?utm_source=launcher&utm_medium=poweredbyzendesk&utm_campaign=text'
                       ].join('');

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(0, 10), 0);
    }

    return (
      /* jshint quotmark:false */
      <div
        className={containerClasses}
        key={this.state.uid}>
        <div className={notifyClasses}>
          <div className='Icon Icon--tick u-inlineBlock' />
          <p className='u-textBold'>{this.state.message}</p>
          <p>
            <a
              href={marketingUrl}
              target='_blank'>
              {i18n.translate('submitTicket.success.info')}
            </a>
          </p>
        </div>
        <SubmitTicketForm
          fullscreen={this.state.fullscreen}
          ref='submitTicketForm'
          className={formClasses}
          submit={this.handleSubmit} />
        <div className='u-nbfc'>
          <a
            href={logoUrl}
            target='_blank'
            className={logoClasses}>
            <span className='u-isHiddenVisually'>zendesk</span>
          </a>
        </div>
      </div>
    );
  }
});
