/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
import { win, location }    from 'utility/globals';
import { transport }        from 'service/transport';
import { SubmitTicketForm } from 'component/SubmitTicketForm';
import { isMobileBrowser }  from 'utility/devices';
import { i18n }             from 'service/i18n';

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

    var tags = ['DROPBOX', 'zendesk_widget'].join(' '),
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
          path: '/embeddable/ticket_submission',
          params: formParams,
          callbacks: {
            done() {
              resCallback(i18n.t('embeddable_framework.submitTicket.notify.message.success'));
            },
            fail() {
              resCallback(i18n.t('embeddable_framework.submitTicket.notify.message.timeout'));
            }
          }
        };

    transport.send(payload);
  },

  handleBackClick() {
    this.props.handleBack();
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
        marketingClasses = classSet({
          'u-isHidden': location.origin !== 'https://www.zendesk.com'
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
          <p className={marketingClasses}>
            <a
              href={marketingUrl}
              target='_blank'>
              {i18n.t('embeddable_framework.submitTicket.marketing.message')}
            </a>
          </p>
        </div>
        <SubmitTicketForm
          fullscreen={this.state.fullscreen}
          ref='submitTicketForm'
          className={formClasses}
          onBackClick={this.handleBackClick}
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
