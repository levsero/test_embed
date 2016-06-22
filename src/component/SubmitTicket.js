import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { AttachmentBox } from 'component/AttachmentBox';
import { Container } from 'component/Container';
import { Icon } from 'component/Icon';
import { ScrollContainer } from 'component/ScrollContainer';
import { SubmitTicketForm } from 'component/SubmitTicketForm';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { isMobileBrowser } from 'utility/devices';
import { location,
         win } from 'utility/globals';
import { bindMethods } from 'utility/utils';

let frameDimensions = {
  width: 0,
  height: 0
};

export class SubmitTicket extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, SubmitTicket.prototype);

    this.state = {
      showNotification: false,
      message: '',
      fullscreen: isMobileBrowser(),
      errorMessage: null,
      uid: _.uniqueId('submitTicketForm_'),
      searchTerm: null,
      searchLocale: null,
      isDragActive: false
    };
  }

  clearNotification() {
    this.setState({ showNotification: false });
  }

  clearForm() {
    const submitTicketForm = this.refs.submitTicketForm;

    submitTicketForm.clear();
  }

  showField() {
    this.setState({showEmail: true});
  }

  handleSubmit(e, data) {
    e.preventDefault();

    this.setState({ errorMessage: null });

    if (!data.isFormValid) {
      // TODO: Handle invalid form submission
      return;
    }

    const formParams = this.props.attachmentsEnabled
                     ? this.formatRequestTicketData(data)
                     : this.formatEmbeddedTicketData(data);

    const failCallback = (err) => {
      const msg = (err.timeout)
                ? i18n.t('embeddable_framework.submitTicket.notify.message.timeout')
                : i18n.t('embeddable_framework.submitTicket.notify.message.error');

      this.setState({ errorMessage: msg });
      this.refs.submitTicketForm.failedToSubmit();
    };
    const doneCallback = (res) => {
      if (res && res.error) {
        failCallback(res.error);
        return;
      }

      this.setState({
        showNotification: true,
        message: i18n.t('embeddable_framework.submitTicket.notify.message.success')
      });
      this.clearForm();
      this.props.onSubmitted({
        res: res,
        searchTerm: this.state.searchTerm,
        searchLocale: this.state.searchLocale
      });
      this.props.updateFrameSize();
    };

    this.props.submitTicketSender(formParams, doneCallback, failCallback);
  }

  formatEmbeddedTicketData(data) {
    const params = {
      'name': data.value.name,
      'email': data.value.email,
      'description': data.value.description,
      'set_tags': 'web_widget',
      'via_id': 48,
      'locale_id': i18n.getLocaleId(),
      'submitted_from': win.location.href
    };

    return this.props.customFields.length === 0
         ? params
         : _.extend(params, this.formatTicketFieldData(data));
  }

  formatRequestTicketData(data) {
    const submittedFrom = i18n.t(
      'embeddable_framework.submitTicket.form.submittedFrom.label',
      {
        fallback: 'Submitted from: %(url)s',
        url: location.href
      }
    );
    const desc = data.value.description;
    const newDesc = `${desc}\n\n------------------\n${submittedFrom}`;
    const uploads = this.refs.submitTicketForm.refs.attachments
                  ? this.refs.submitTicketForm.refs.attachments.getAttachmentTokens()
                  : null;
    const params = {
      'subject': (desc.length <= 50) ? desc : `${desc.slice(0,50)}...`,
      'set_tags': 'web_widget',
      'via_id': 48,
      'comment': {
        'body': newDesc,
        'uploads': uploads
      },
      'requester': {
        'name': data.value.name,
        'email': data.value.email,
        'locale_id': i18n.getLocaleId()
      }
    };

    return this.props.customFields.length === 0
         ? { request: params }
         : { request: _.extend(params, this.formatTicketFieldData(data)) };
  }

  formatTicketFieldData(data) {
    let params = {
      fields: {}
    };

    _.forEach(data.value, function(value, name) {
      // Custom field names are numbers so we check if name is NaN
      if (!isNaN(parseInt(name, 10))) {
        params.fields[name] = value;
      }
    });

    return params;
  }

  handleDragEnter() {
    this.setState({
      isDragActive: true
    });
  }

  handleDragLeave() {
    this.setState({
      isDragActive: false
    });
  }

  handleOnDrop(files) {
    this.setState({
      isDragActive: false
    });
    this.refs.submitTicketForm.handleOnDrop(files);
  }

  render() {
    const notifyClasses = classNames({
      'u-textCenter': true,
      'u-isHidden': !this.state.showNotification
    });
    const errorClasses = classNames({
      'Error u-marginTL': true,
      'u-isHidden': !this.state.errorMessage
    });

    if (this.props.updateFrameSize) {
      setTimeout(() => {
        frameDimensions = this.props.updateFrameSize();
      }, 0);
    }

    const zendeskLogo = this.props.hideZendeskLogo || this.state.fullscreen
                      ? null
                      : <ZendeskLogo
                          formSuccess={this.state.showNotification}
                          rtl={i18n.isRTL()}
                          fullscreen={this.state.fullscreen} />;
    const attachmentBox = this.state.isDragActive && this.props.attachmentsEnabled
                        ? <AttachmentBox
                            onDragLeave={this.handleDragLeave}
                            dimensions={frameDimensions}
                            onDrop={this.handleOnDrop} />
                        : null;

    return (
      <Container
        style={this.props.style}
        fullscreen={this.state.fullscreen}
        position={this.props.position}
        onDragEnter={this.handleDragEnter}
        key={this.state.uid}>
        {attachmentBox}
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
          formTitleKey={this.props.formTitleKey}
          attachmentSender={this.props.attachmentSender}
          attachmentsEnabled={this.props.attachmentsEnabled}
          maxFileLimit={this.props.maxFileLimit}
          maxFileSize={this.props.maxFileSize}
          submit={this.handleSubmit}>
          <p className={errorClasses}>
            {this.state.errorMessage}
          </p>
        </SubmitTicketForm>
        {zendeskLogo}
      </Container>
    );
  }
}

SubmitTicket.propTypes = {
  formTitleKey: PropTypes.string.isRequired,
  submitTicketSender: PropTypes.func.isRequired,
  attachmentSender: PropTypes.func.isRequired,
  updateFrameSize: PropTypes.any,
  hideZendeskLogo: PropTypes.bool,
  customFields: PropTypes.array,
  style: PropTypes.object,
  position: PropTypes.string,
  onSubmitted: PropTypes.func,
  onCancel: PropTypes.func,
  attachmentsEnabled: PropTypes.bool,
  maxFileLimit: PropTypes.number,
  maxFileSize: PropTypes.number
};

SubmitTicket.defaultProps = {
  updateFrameSize: false,
  hideZendeskLogo: false,
  customFields: [],
  style: null,
  position: 'right',
  onSubmitted: () => {},
  onCancel: () => {},
  attachmentsEnabled: false,
  maxFileLimit: 5,
  maxFileSize: 5 * 1024 * 1024
};
