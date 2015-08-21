import React from 'react/addons';
import _     from 'lodash';

import { win }              from 'utility/globals';
import { transport }        from 'service/transport';
import { SubmitTicketForm } from 'component/SubmitTicketForm';
import { ZendeskLogo }      from 'component/ZendeskLogo';
import { Container }        from 'component/Container';
import { ScrollContainer }  from 'component/ScrollContainer';
import { isMobileBrowser }  from 'utility/devices';
import { Icon }             from 'component/Icon';
import { i18n }             from 'service/i18n';

const classSet = React.addons.classSet;

export var SubmitTicket = React.createClass({
  getInitialState() {
    return {
      showNotification: false,
      message: '',
      fullscreen: isMobileBrowser(),
      errorMessage: '',
      uid: _.uniqueId('submitTicketForm_'),
      searchString: null,
      searchLocale: null
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
    const submitTicketForm = this.refs.submitTicketForm;
    const formData = submitTicketForm.state.formState;

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

    const formParams = _.extend(
      {
        'set_tags': 'web_widget',
        'via_id': 48,
        'locale_id': i18n.getLocaleId(),
        'submitted_from': win.location.href
      },
      this.formatTicketSubmission(data)
    );
    const resCallback = (res) => {
      this.setState({
        showNotification: true,
        message: i18n.t('embeddable_framework.submitTicket.notify.message.success')
      });
      this.clearForm();
      this.props.onSubmitted({
        res: res,
        searchString: this.state.searchString,
        searchLocale: this.state.searchLocale
      });
      this.props.updateFrameSize();
    };
    const errorCallback = (msg) => {
      this.setState({ errorMessage: msg });
      this.refs.submitTicketForm.failedToSubmit();
    };
    const payload = {
      method: 'post',
      path: '/requests/embedded/create',
      params: formParams,
      callbacks: {
        done(res) {
          if (res.error) {
            errorCallback(i18n.t('embeddable_framework.submitTicket.notify.message.error'));
          } else {
            resCallback(res);
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
    const notifyClasses = classSet({
      'u-textCenter': true,
      'u-isHidden': !this.state.showNotification
    });
    const errorClasses = classSet({
      'Error u-marginTL': true,
      'u-isHidden': !this.state.errorMessage
    });

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    /* jshint laxbreak: true */
    const zendeskLogo = this.props.hideZendeskLogo || this.state.fullscreen
                      ? null
                      : <ZendeskLogo
                          formSuccess={this.state.showNotification}
                          rtl={i18n.isRTL()}
                          fullscreen={this.state.fullscreen} />;

    return (
      <Container
        style={this.props.style}
        fullscreen={this.state.fullscreen}
        position={this.props.position}
        key={this.state.uid}>
        <div className={notifyClasses} ref='notification'>
          <ScrollContainer
            title={this.state.message}>
            <Icon
              type='Icon--tick'
              className='u-inlineBlock u-userTextColor u-posRelative u-marginTL u-userFillColor' />
          </ScrollContainer>
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
