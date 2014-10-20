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
      errorMessage: '',
      uid: _.uniqueId('submitTicketForm_')
    };
  },

  reset() {
    var submitTicketForm = this.refs.submitTicketForm,
        valueObj         = submitTicketForm.refs.form.value().value;

    this.setState({showNotification: false});
    submitTicketForm.refs.form.updateValue({
      name: valueObj.name,
      email: valueObj.email,
      description: ''
    });
    submitTicketForm.setState(submitTicketForm.getInitialState());
  },

  showField: function() {
    this.setState({showEmail: true});
  },

  handleSubmit(e, data) {
    e.preventDefault();

    this.setState({errorMessage: ''});

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
        resCallback = () => {
          this.setState({
            showNotification: true,
            message: i18n.t('embeddable_framework.submitTicket.notify.message.success')
          });
          this.props.onSubmitted();
          this.props.updateFrameSize(0,0);
        },
        timeoutCallback = () => {
          this.setState({
            errorMessage: i18n.t('embeddable_framework.submitTicket.notify.message.timeout')
          });

          this.refs.submitTicketForm.setState({
            isSubmitting: false,
            buttonMessage: i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send')
          });
        },
        failCallback = () => {
          this.setState({
            errorMessage: i18n.t('embeddable_framework.submitTicket.notify.message.error')
          });
        },
        payload = {
          method: 'post',
          path: '/embeddable/ticket_submission',
          params: formParams,
          callbacks: {
            done(res) {
              if (res.error) {
                failCallback();
              } else {
                resCallback();
              }
            },
            fail(err) {
              if (err.timeout) {
                timeoutCallback();
              } else {
                failCallback();
              }
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
        containerBarClasses = classSet({
          'Container-bar Container-pullout u-borderBottom': true,
          'u-isHidden': !this.state.fullscreen
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
        errorClasses = classSet({
          'Error': true,
          'u-isHidden': !this.state.errorMessage
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
        <div className={containerBarClasses} />
        <div className={notifyClasses}>
          <div className='Icon Icon--tick u-inlineBlock' />
          <p className='u-textBold u-textSizeMed'>{this.state.message}</p>
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
          submit={this.handleSubmit}>
          <p className={errorClasses}>
            {this.state.errorMessage}
          </p>
        </SubmitTicketForm>
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
