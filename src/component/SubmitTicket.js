import React from 'react/addons';
import _     from 'lodash';

import { win }              from 'utility/globals';
import { transport }        from 'service/transport';
import { SubmitTicketForm } from 'component/SubmitTicketForm';
import { ZendeskLogo }      from 'component/ZendeskLogo';
import { Container }        from 'component/Container';
import { isMobileBrowser }  from 'utility/devices';
import { i18n }             from 'service/i18n';

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

  clearNotification() {
    this.setState({ showNotification: false });
  },

  clearForm() {
    var submitTicketForm = this.refs.submitTicketForm,
        formData = submitTicketForm.state.formState;

    submitTicketForm.setState(submitTicketForm.getInitialState());
    submitTicketForm.setState({
      showNotification: true,
      formState: {
        name: formData.name,
        email: formData.email
      }
    });
  },

  showField: function() {
    this.setState({showEmail: true});
  },

  handleSubmit(e, data) {
    e.preventDefault();

    this.setState({errorMessage: ''});

    if (!data.isFormValid) {
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
          this.clearForm();
          this.props.onSubmitted();
          this.props.updateFrameSize();
        },
        errorCallback = (msg) => {
          this.setState({ errorMessage: msg });
          this.refs.submitTicketForm.failedToSubmit();
        },
        payload = {
          method: 'post',
          path: '/requests/embedded/create',
          params: formParams,
          callbacks: {
            done(res) {
              if (res.error) {
                errorCallback(i18n.t('embeddable_framework.submitTicket.notify.message.error'));
              } else {
                resCallback();
              }
            },
            fail(err) {
              if (err.timeout) {
                errorCallback(i18n.t('embeddable_framework.submitTicket.notify.message.timeout'));
              } else {
                errorCallback(i18n.t('embeddable_framework.submitTicket.notify.message.error'));
              }
            }
          }
        };

    transport.send(payload);
  },

  formatTicketSubmission(data) {
    if (this.props.customFields.length === 0) {
      return data.value;
    } else {
      let params = {
        fields: {}
      };

      _.forEach(data.value, function(value, name) {
        // Custom field names are numbers so we check if name is NaN
        if (isNaN(parseInt(name, 10))) {
          params[name] = value;
        } else {
          params.fields[name] = value;
        }
      });

      return params;
    }
  },

  render() {
    var notifyClasses = classSet({
          'Notify': true,
          'u-textCenter': true,
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
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    /* jshint laxbreak: true */
    zendeskLogo = this.props.hideZendeskLogo
                ? null
                : <ZendeskLogo
                    formSuccess={this.state.showNotification}
                    rtl={i18n.isRTL()}
                    fullscreen={this.state.fullscreen}
                  />;

    return (
      <Container
        fullscreen={this.state.fullscreen}
        position={this.props.position}
        key={this.state.uid}>
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
          onCancel={this.props.onCancel}
          fullscreen={this.state.fullscreen}
          ref='submitTicketForm'
          hide={this.state.showNotification}
          customFields={this.props.customFields}
          submit={this.handleSubmit}>
          <p className={errorClasses}>
            {this.state.errorMessage}
          </p>
        </SubmitTicketForm>
        {zendeskLogo}
      </Container>
    );
  }
});
