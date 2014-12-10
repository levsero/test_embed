/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
import { win }              from 'utility/globals';
import { transport }        from 'service/transport';
import { SubmitTicketForm } from 'component/SubmitTicketForm';
import { ZendeskLogo }      from 'component/ZendeskLogo';
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

  getDefaultProps() {
    return {
      customFields: []
    };
  },

  reset() {
    var submitTicketForm = this.refs.submitTicketForm,
        formData         = submitTicketForm.refs.form.value().value;

    this.setState({showNotification: false});
    submitTicketForm.refs.form.updateValue({
      name: formData.name,
      email: formData.email
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

    var formParams = _.extend({
          'set_tags': 'web_widget',
          'via_id': 48,
          'locale_id': i18n.getLocaleId(),
          'submitted_from': win.location.href
        }, this.formatTicketSubmission(data)),
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
          path: '/requests/embedded/create',
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

  formatTicketSubmission(data) {
    var params = {};

    if (this.props.customFields.length === 0) {
      return data.value;
    } else {
      params.fields = {};
      _.forEach(data.value, function(value, name) {
        // In react forms if the name of a field only contains numbers it reorders the
        // form. We add the ze to the forms so they retain their order then remove them here.
        if (name.substring(0,2) !== 'ze') {
          params[name] = value;
        } else {
          // For checkbox field, it returns the array [1] if its selected.
          // This takes the 1 out of the array so the endpoint knows how to handle it.
          if (_.isArray(value)) {
            value = value[0];
          }

          params.fields[name.slice(2)] = value;
        }
      });

      return params;
    }
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
        containerBarClasses = classSet({
          'Container-bar u-borderBottom': true,
          'u-isHidden': !this.state.fullscreen
        }),
        notifyClasses = classSet({
          'Notify': true,
          'u-textCenter': true,
          'Arrange-sizeFill': this.state.fullscreen,
          'u-isHidden': !this.state.showNotification
        }),
        marketingClasses = classSet({
          'u-isHidden': true
        }),
        errorClasses = classSet({
          'Error': true,
          'u-isHidden': !this.state.errorMessage
        }),
        marketingUrl = ['//www.zendesk.com/embeddables/',
                        '?utm_source=webwidget&utm_medium=poweredbyzendesk&utm_campaign=text'
                       ].join(''),
        zendeskLogo;

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(0, 10), 0);
    }

    if (this.props.zendeskLogoEnabled) {
      zendeskLogo = <ZendeskLogo showNotification={this.state.showNotification} />;
    }

    return (
      /* jshint quotmark:false */
      <div
        className={containerClasses}
        key={this.state.uid}>
        <div className={containerBarClasses} />
        <div className={notifyClasses}>
          <div className='Icon Icon--tick u-inlineBlock u-userTextColor' />
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
          customFields={this.props.customFields}
          submit={this.handleSubmit}>
          <p className={errorClasses}>
            {this.state.errorMessage}
          </p>
        </SubmitTicketForm>
        {zendeskLogo}
      </div>
    );
  }
});
