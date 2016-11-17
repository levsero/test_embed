import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { AttachmentBox } from 'component/attachment/AttachmentBox';
import { Container } from 'component/Container';
import { SelectField } from 'component/field/SelectField';
import { Icon } from 'component/Icon';
import { ScrollContainer } from 'component/ScrollContainer';
import { SubmitTicketForm } from 'component/submitTicket/SubmitTicketForm';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { settings } from 'service/settings';
import { isMobileBrowser } from 'utility/devices';
import { location } from 'utility/globals';
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
      formTitleKey: props.formTitleKey,
      showNotification: false,
      message: '',
      fullscreen: isMobileBrowser(),
      errorMessage: null,
      uid: _.uniqueId('submitTicketForm_'),
      searchTerm: null,
      searchLocale: null,
      isDragActive: false,
      ticketForms: {},
      selectedTicketForm: null
    };
  }

  clearNotification() {
    this.setState({ showNotification: false });
  }

  clearForm() {
    const submitTicketForm = this.refs.submitTicketForm;

    submitTicketForm.clear();

    this.setState({ selectedTicketForm: null });
  }

  showField() {
    this.setState({ showEmail: true });
  }

  handleSubmit(e, data) {
    e.preventDefault();

    this.setState({ errorMessage: null });

    if (!data.isFormValid) {
      // TODO: Handle invalid form submission
      return;
    }

    const formParams = this.formatRequestTicketData(data);

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

      const params = {
        res: res,
        email: formParams.email,
        searchTerm: this.state.searchTerm,
        searchLocale: this.state.searchLocale
      };

      if (this.props.attachmentsEnabled) {
        const attachmentsList = this.refs.submitTicketForm.refs.attachments;

        // When the MIME type is unknown use 'application/octet-stream' which
        // represents arbitrary binary data.
        // Reference: http://stackoverflow.com/questions/1176022/unknown-file-type-mime
        const attachmentTypes = _.chain(attachmentsList.uploadedAttachments())
                                 .map('file.type')
                                 .map((t) => _.isEmpty(t) ? 'application/octet-stream' : t)
                                 .value();

        _.extend(params, {
          email: formParams.request.requester.email,
          attachmentsCount: attachmentsList.numUploadedAttachments(),
          attachmentTypes: attachmentTypes
        });
      }

      this.props.onSubmitted(params);
      this.clearForm();
      this.props.updateFrameSize();
    };

    this.props.submitTicketSender(formParams, doneCallback, failCallback);
  }

  findField(fieldName) {
    return _.find(this.state.ticketForms.ticket_fields, (field) => {
      return field.raw_title === fieldName && field.removable === false;
    });
  }

  formatRequestTicketData(data) {
    const ticketFormsAvailable = !!this.state.ticketForms.ticket_forms;
    const submittedFrom = i18n.t(
      'embeddable_framework.submitTicket.form.submittedFrom.label',
      { url: location.href }
    );
    const descriptionData = ticketFormsAvailable
               ? data.value[this.findField('Description').id]
               : data.value.description;
    const subjectData = ticketFormsAvailable
                      ? data.value[this.findField('Subject').id]
                      : data.value.subject;
    const description = `${descriptionData}\n\n------------------\n${submittedFrom}`;
    const uploads = this.refs.submitTicketForm.refs.attachments
                  ? this.refs.submitTicketForm.refs.attachments.getAttachmentTokens()
                  : null;
    const subject = (this.props.subjectEnabled || ticketFormsAvailable) && !_.isEmpty(subjectData)
                  ? subjectData
                  : (descriptionData.length <= 50) ? descriptionData : `${descriptionData.slice(0,50)}...`;
    const params = {
      'subject': subject,
      'tags': ['web_widget'],
      'via_id': settings.get('viaId'),
      'comment': {
        'body': description,
        'uploads': uploads
      },
      'requester': {
        'name': data.value.name,
        'email': data.value.email,
        'locale_id': i18n.getLocaleId()
      }
    };

    return this.props.customFields.length > 0 || ticketFormsAvailable
         ? { request: _.extend(params, this.formatTicketFieldData(data)) }
         : { request: params };
  }

  formatTicketFieldData(data) {
    let params = {
      fields: {}
    };
    const subjectField = this.findField('Subject');
    const subjectFieldId = subjectField ? subjectField.id : null;
    const descriptionField = this.findField('Description');
    const descriptionFieldId = descriptionField ? descriptionField.id : null;

    _.forEach(data.value, function(value, name) {
      // Custom field names are numbers so we check if name is NaN
      const nameInt = parseInt(name, 10);

      if (!isNaN(nameInt) && nameInt !== subjectFieldId && nameInt !== descriptionFieldId) {
        params.fields[name] = value;
      }
    });

    return params;
  }

  updateTicketForms(forms) {
    this.setState({ ticketForms: forms });
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

  setFormTitleKey(formTitleKey) {
    this.setState({ formTitleKey });
  }

  handleSelectorChange(e, v) {
    const selectedTicketForm = _.find(this.state.ticketForms.ticket_forms, (f) => {
      return f.id === parseInt(v);
    });

    this.setState({ selectedTicketForm: selectedTicketForm });

    this.props.showBackButton();

    setTimeout(() => {
      this.refs.submitTicketForm.updateTicketForm(
        selectedTicketForm,
        this.state.ticketForms.ticket_fields
      );
    }, 0);
  }

  renderForm() {
    const errorClasses = classNames({
      'Error u-marginTL': true,
      'u-isHidden': !this.state.errorMessage
    });

    return (
      <SubmitTicketForm
        onCancel={this.props.onCancel}
        fullscreen={this.state.fullscreen}
        ref='submitTicketForm'
        hide={this.state.showNotification}
        customFields={this.props.customFields}
        formTitleKey={this.state.formTitleKey}
        attachmentSender={this.props.attachmentSender}
        attachmentsEnabled={this.props.attachmentsEnabled}
        subjectEnabled={this.props.subjectEnabled}
        maxFileCount={this.props.maxFileCount}
        maxFileSize={this.props.maxFileSize}
        submit={this.handleSubmit}
        ticketForms={this.state.ticketForms}
        previewEnabled={this.props.previewEnabled}>
        <p className={errorClasses}>
          {this.state.errorMessage}
        </p>
      </SubmitTicketForm>
    );
  }

  renderNotifications() {
    const notifyClasses = classNames({
      'u-textCenter': true,
      'u-isHidden': !this.state.showNotification
    });

    return (
      <div className={notifyClasses} ref='notification'>
        <ScrollContainer
          title={this.state.message}>
          <Icon
            type='Icon--tick'
            className='u-inlineBlock u-userTextColor u-posRelative u-marginTL u-userFillColor' />
        </ScrollContainer>
      </div>
    );
  }

  renderTicketFormSelector() {
    const { ticketForms } = this.state;
    const options = _.map(ticketForms.ticket_forms, (form) => {
      return {
        title: form.display_name,
        value: form.id
      };
    });
    const title = i18n.t(
      'embeddable_framework.submitTicket.ticketForms.title',
      { fallback: 'Please choose your issue below' }
    );

    return (
      <ScrollContainer
        title={i18n.t(`embeddable_framework.submitTicket.form.title.${this.state.formTitleKey}`)}
        ref='ticketFormSelector'
        footerContentHidden={true}
        borderBottom={true}
        containerClasses='ticketFormSelector--fixed'
        footerClasses='u-borderTop u-marginHL'
        fixHeight={true}>
        <div className='u-paddingTS'>
          <SelectField
            name={title}
            placeholder={title}
            value={this.state.ticketForm}
            onChange={this.handleSelectorChange}
            options={options} />
        </div>
      </ScrollContainer>
    );
  }

  renderZendeskLogo() {
    return this.props.hideZendeskLogo || this.state.fullscreen
         ? null
         : <ZendeskLogo
             formSuccess={this.state.showNotification}
             rtl={i18n.isRTL()}
             fullscreen={this.state.fullscreen} />;
  }

  renderAttachmentBox() {
    return this.state.isDragActive && this.props.attachmentsEnabled
         ? <AttachmentBox
             onDragLeave={this.handleDragLeave}
             dimensions={frameDimensions}
             onDrop={this.handleOnDrop} />
         : null;
  }

  render() {
    setTimeout(() => {
      frameDimensions = this.props.updateFrameSize();
    }, 0);

    const display = (_.isEmpty(this.state.ticketForms) || this.state.selectedTicketForm)
                  ? this.renderForm()
                  : this.renderTicketFormSelector();

    return (
      <Container
        style={this.props.style}
        fullscreen={this.state.fullscreen}
        position={this.props.position}
        onDragEnter={this.handleDragEnter}
        key={this.state.uid}>
        {this.renderAttachmentBox()}
        {this.renderNotifications()}
        {display}
        {this.renderZendeskLogo()}
      </Container>
    );
  }
}

SubmitTicket.propTypes = {
  formTitleKey: PropTypes.string.isRequired,
  submitTicketSender: PropTypes.func.isRequired,
  attachmentSender: PropTypes.func.isRequired,
  previewEnabled: PropTypes.bool,
  updateFrameSize: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  customFields: PropTypes.array,
  style: PropTypes.object,
  position: PropTypes.string,
  onSubmitted: PropTypes.func,
  onCancel: PropTypes.func,
  attachmentsEnabled: PropTypes.bool,
  subjectEnabled: PropTypes.bool,
  maxFileCount: PropTypes.number,
  maxFileSize: PropTypes.number,
  showBackButton: PropTypes.func
};

SubmitTicket.defaultProps = {
  previewEnabled: false,
  updateFrameSize: () => {},
  hideZendeskLogo: false,
  customFields: [],
  style: null,
  position: 'right',
  onSubmitted: () => {},
  onCancel: () => {},
  attachmentsEnabled: false,
  subjectEnabled: false,
  maxFileCount: 5,
  maxFileSize: 5 * 1024 * 1024,
  showBackButton: () => {}
};
