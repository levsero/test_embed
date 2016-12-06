import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { locals as styles } from './SubmitTicket.sass';

import { AttachmentBox } from 'component/attachment/AttachmentBox';
import { Container } from 'component/Container';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { Icon } from 'component/Icon';
import { ScrollContainer } from 'component/ScrollContainer';
import { SubmitTicketForm } from 'component/submitTicket/SubmitTicketForm';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { settings } from 'service/settings';
import { isMobileBrowser,
         isIE } from 'utility/devices';
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
      loading: false,
      ticketForms: {},
      selectedTicketForm: null
    };
  }

  clearNotification() {
    this.setState({ showNotification: false });
  }

  clearForm() {
    this.refs.submitTicketForm.clear();

    this.setState({ selectedTicketForm: null });
  }

  showField() {
    this.setState({ showEmail: true });
  }

  setLoading(value) {
    this.setState({ loading: value });
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

      this.props.showBackButton(false);
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
    this.setState({
      ticketForms: forms,
      loading: false
    });

    if (forms.ticket_forms.length === 1) {
      this.setState({ selectedTicketForm: forms.ticket_forms[0].id });

      setTimeout(() => {
        this.refs.submitTicketForm.updateTicketForm(
          forms.ticket_forms[0],
          forms.ticket_fields
        );
      }, 0);
    }
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

  handleTicketFormsListClick(e) {
    const value = e.target.dataset.id;
    const { ticketForms } = this.state;
    const selectedTicketForm = _.find(ticketForms.ticket_forms, (f) => {
      return f.id === parseInt(value);
    });

    this.setState({ selectedTicketForm: selectedTicketForm });

    this.props.showBackButton();

    setTimeout(() => {
      this.refs.submitTicketForm.updateTicketForm(selectedTicketForm, ticketForms.ticket_fields);
    }, 0);
  }

  renderLoadingSpinner() {
    let spinnerClasses = styles.loadingSpinner;

    if (isIE()) {
      spinnerClasses = `${spinnerClasses} ${styles.loadingSpinnerIE}`;
    }

    return (
      <ScrollContainer
        title={i18n.t(`embeddable_framework.submitTicket.form.title.${this.state.formTitleKey}`)}
        fullscreen={this.state.fullscreen}
        containerClasses={styles.ticketFormsContainer}>
        <div className={spinnerClasses}>
          <LoadingSpinner />
        </div>
      </ScrollContainer>
    );
  }

  renderErrorMessage() {
    if (!this.state.errorMessage) return;

    return (
      <p className={styles.error}>
        {this.state.errorMessage}
      </p>
    );
  }

  renderForm() {
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
        {this.renderErrorMessage()}
      </SubmitTicketForm>
    );
  }

  renderNotifications() {
    if (!this.state.showNotification) return;

    const iconClasses = `${styles.notifyIcon} u-userFillColor u-userTextColor`;

    return (
      <div className={styles.notify} ref='notification'>
        <ScrollContainer title={this.state.message}>
          <Icon
            type='Icon--tick'
            className={iconClasses} />
        </ScrollContainer>
      </div>
    );
  }

  renderTicketFormList() {
    if (this.state.showNotification) return;

    const { ticketForms, fullscreen } = this.state;
    const mobileClasses = fullscreen ? styles.ticketFormsListMobile : '';
    const options = _.map(ticketForms.ticket_forms, (form) => {
      return (
        <div data-id={form.id} className={`${styles.ticketFormsList} u-userTextColor ${mobileClasses}`}>
          {form.display_name}
        </div>
      );
    });
    const containerClasses = fullscreen
                           ? styles.ticketFormsContainerMobile
                           : styles.ticketFormsContainer;
    const footerClasses = fullscreen
                        ? styles.ticketFormsFooterMobile
                        : styles.ticketFormsFooter;
    const titleMobileClasses = fullscreen ? styles.ticketFormsListMobile : '';

    return (
      <ScrollContainer
        title={i18n.t(`embeddable_framework.submitTicket.form.title.${this.state.formTitleKey}`)}
        ref='ticketFormSelector'
        footerContentHidden={true}
        fullscreen={fullscreen}
        containerClasses={containerClasses}
        footerClasses={footerClasses}>
        <div className={`${styles.ticketFormsListTitle} ${titleMobileClasses}`}>
          {i18n.t('embeddable_framework.submitTicket.ticketForms.title')}
        </div>
        <div onClick={this.handleTicketFormsListClick}>
          {options}
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

    const content = (_.isEmpty(this.state.ticketForms) || this.state.selectedTicketForm)
                  ? this.renderForm()
                  : this.renderTicketFormList();
    const display = this.state.loading
                  ? this.renderLoadingSpinner()
                  : content;

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
