import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { locals as styles } from './SubmitTicket.sass';

import { AttachmentBox } from 'component/attachment/AttachmentBox';
import { Container } from 'component/container/Container';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { Icon } from 'component/Icon';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { SubmitTicketForm } from 'component/submitTicket/SubmitTicketForm';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { store } from 'service/persistence';
import { isMobileBrowser,
         isIE } from 'utility/devices';
import { location } from 'utility/globals';

let frameDimensions = {
  height: 0,
  width: 0
};

export class SubmitTicket extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool,
    attachmentSender: PropTypes.func.isRequired,
    disableAutoComplete: PropTypes.bool,
    formTitleKey: PropTypes.string.isRequired,
    hideZendeskLogo: PropTypes.bool,
    maxFileCount: PropTypes.number,
    maxFileSize: PropTypes.number,
    onCancel: PropTypes.func,
    onSubmitted: PropTypes.func,
    position: PropTypes.string,
    previewEnabled: PropTypes.bool,
    showBackButton: PropTypes.func,
    style: PropTypes.object,
    subjectEnabled: PropTypes.bool,
    submitTicketSender: PropTypes.func.isRequired,
    tags: PropTypes.array,
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    updateFrameSize: PropTypes.func,
    viaId: PropTypes.number.isRequired
  };

  static defaultProps = {
    attachmentsEnabled: false,
    disableAutoComplete: false,
    hideZendeskLogo: false,
    maxFileCount: 5,
    maxFileSize: 5 * 1024 * 1024,
    onCancel: () => {},
    onSubmitted: () => {},
    position: 'right',
    previewEnabled: false,
    showBackButton: () => {},
    style: null,
    subjectEnabled: false,
    tags: [],
    ticketFieldSettings: [],
    ticketFormSettings: [],
    updateFrameSize: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      errorMessage: null,
      formState: {},
      formTitleKey: props.formTitleKey,
      fullscreen: isMobileBrowser(),
      isDragActive: false,
      loading: false,
      message: '',
      searchLocale: null,
      searchTerm: null,
      selectedTicketForm: null,
      showNotification: false,
      ticketFields: [],
      ticketForms: {},
      uid: _.uniqueId('submitTicketForm_')
    };
  }

  clearNotification = () => {
    this.setState({ showNotification: false });
  }

  clearForm = () => {
    /* eslint camelcase:0 */
    const { ticket_forms } = this.state.ticketForms;

    this.refs.submitTicketForm.clear();

    if (ticket_forms && ticket_forms.length > 1) {
      this.setState({ selectedTicketForm: null });
    }
  }

  setLoading = (loading) => {
    this.setState({ loading });
  }

  setFormState = (formState) => {
    this.setState({ formState });
  }

  handleSubmit = (e, data) => {
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

  findField = (fieldType) => {
    return _.find(this.state.ticketForms.ticket_fields, (field) => {
      return field.type === fieldType && field.removable === false;
    });
  }

  formatRequestTicketData = (data) => {
    const ticketFormsAvailable = !!this.state.ticketForms.ticket_forms;
    const submittedFrom = i18n.t(
      'embeddable_framework.submitTicket.form.submittedFrom.label',
      { url: location.href }
    );
    const descriptionData = ticketFormsAvailable
               ? data.value[this.findField('description').id]
               : data.value.description;
    const subjectField = this.findField('subject');
    const subjectData = ticketFormsAvailable && subjectField
                      ? data.value[subjectField.id]
                      : data.value.subject;
    const referrerPolicy = store.get('referrerPolicy', 'session');
    const descriptionUrlStr = `\n\n------------------\n${submittedFrom}`;
    const description = referrerPolicy ? descriptionData : `${descriptionData}${descriptionUrlStr}`;
    const uploads = this.refs.submitTicketForm.refs.attachments
                  ? this.refs.submitTicketForm.refs.attachments.getAttachmentTokens()
                  : null;
    const subject = (this.props.subjectEnabled || ticketFormsAvailable) && !_.isEmpty(subjectData)
                  ? subjectData
                  : (descriptionData.length <= 50) ? descriptionData : `${descriptionData.slice(0,50)}...`;
    const params = {
      'subject': subject,
      'tags': ['web_widget'].concat(this.props.tags),
      'via_id': this.props.viaId,
      'comment': {
        'body': description,
        'uploads': uploads
      },
      'requester': {
        'name': data.value.name,
        'email': data.value.email,
        'locale_id': i18n.getLocaleId()
      },
      'ticket_form_id': ticketFormsAvailable ? this.state.selectedTicketForm.id : null
    };

    return this.state.ticketFields.length > 0
           || ticketFormsAvailable
         ? { request: _.extend(params, this.formatTicketFieldData(data)) }
         : { request: params };
  }

  formatTicketFieldData = (data) => {
    let params = { fields: {} };
    const subjectField = this.findField('subject');
    const subjectFieldId = subjectField ? subjectField.id : null;
    const descriptionField = this.findField('description');
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

  updateContactForm = () => {
    this.refs.submitTicketForm.updateContactForm(this.props.ticketFieldSettings);
  }

  updateTicketFields = (fields) => {
    this.setState({
      ticketFields: fields,
      loading: false
    });

    this.updateContactForm();
  }

  handleDragEnter = () => {
    this.setState({ isDragActive: true });
  }

  handleDragLeave = () => {
    this.setState({ isDragActive: false });
  }

  handleOnDrop = (files) => {
    this.setState({ isDragActive: false });
    this.refs.submitTicketForm.handleOnDrop(files);
  }

  setFormTitleKey = (formTitleKey) => {
    this.setState({ formTitleKey });
  }

  updateSubmitTicketForm = (selectedTicketForm, ticketFormPrefill = {}) => {
    const updateFormFn = () => {
      this.refs.submitTicketForm.updateTicketForm(
        selectedTicketForm,
        this.state.ticketForms.ticket_fields,
        ticketFormPrefill.fields,
        this.props.ticketFieldSettings
      );
    };

    this.setState({ selectedTicketForm }, updateFormFn);
  }

  updateTicketForms = (forms) => {
    let callbackFn = () => {};
    const { ticket_forms: ticketForms } = forms;
    const { ticketFormSettings } = this.props;

    if (ticketForms.length === 1) {
      callbackFn = () => this.updateSubmitTicketForm(ticketForms[0], ticketFormSettings[0]);
    } else if (this.state.selectedTicketForm) {
      callbackFn = () => this.setTicketForm(this.state.selectedTicketForm.id);
    }

    this.setState({
      ticketForms: forms,
      loading: false
    }, callbackFn);
  }

  setTicketForm = (ticketFormId) => {
    const { ticket_forms } = this.state.ticketForms;

    if (Array.isArray(ticket_forms) && ticket_forms.length === 0) return;

    const getformByIdFn = (form) => form.id === parseInt(ticketFormId);
    const selectedTicketForm = _.find(ticket_forms, getformByIdFn);
    const ticketFormPrefill = _.find(this.props.ticketFormSettings, getformByIdFn);

    this.props.showBackButton();
    this.updateSubmitTicketForm(selectedTicketForm, ticketFormPrefill);
  }

  handleTicketFormsListClick = (e) => {
    const ticketFormId = e && e.target.getAttribute('data-id');

    this.setTicketForm(ticketFormId);
  }

  renderLoadingSpinner = () => {
    const spinnerIEClasses = isIE() ? styles.loadingSpinnerIE : '';

    return (
      <ScrollContainer
        title={i18n.t(`embeddable_framework.submitTicket.form.title.${this.state.formTitleKey}`)}
        fullscreen={this.state.fullscreen}
        containerClasses={styles.ticketFormsContainer}>
        <div className={`${styles.loadingSpinner} ${spinnerIEClasses}`}>
          <LoadingSpinner />
        </div>
      </ScrollContainer>
    );
  }

  renderErrorMessage = () => {
    if (!this.state.errorMessage) return;

    return (
      <p className={styles.error}>
        {this.state.errorMessage}
      </p>
    );
  }

  renderForm = () => {
    return (
      <SubmitTicketForm
        ref='submitTicketForm'
        onCancel={this.props.onCancel}
        fullscreen={this.state.fullscreen}
        hide={this.state.showNotification}
        customFields={this.state.ticketFields}
        disableAutoComplete={this.props.disableAutoComplete}
        formTitleKey={this.state.formTitleKey}
        attachmentSender={this.props.attachmentSender}
        attachmentsEnabled={this.props.attachmentsEnabled}
        subjectEnabled={this.props.subjectEnabled}
        maxFileCount={this.props.maxFileCount}
        maxFileSize={this.props.maxFileSize}
        formState={this.state.formState}
        setFormState={this.setFormState}
        submit={this.handleSubmit}
        ticketForms={this.state.ticketForms}
        frameHeight={frameDimensions.height}
        previewEnabled={this.props.previewEnabled}>
        {this.renderErrorMessage()}
      </SubmitTicketForm>
    );
  }

  renderNotifications = () => {
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

  renderTicketFormOptions = () => {
    const { ticketForms, fullscreen } = this.state;
    const mobileClasses = fullscreen ? styles.ticketFormsListMobile : '';

    return _.map(ticketForms.ticket_forms, (form) => {
      return (
        <div data-id={form.id} className={`${styles.ticketFormsList} u-userTextColor ${mobileClasses}`}>
          {form.display_name}
        </div>
      );
    });
  }

  renderTicketFormList = () => {
    if (this.state.showNotification) return;

    const { fullscreen } = this.state;
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
        fullscreen={fullscreen}
        scrollShadowVisible={!fullscreen}
        containerClasses={containerClasses}
        footerClasses={footerClasses}>
        <div className={`${styles.ticketFormsListTitle} ${titleMobileClasses}`}>
          {i18n.t('embeddable_framework.submitTicket.ticketForms.title')}
        </div>
        <div onClick={this.handleTicketFormsListClick}>
          {this.renderTicketFormOptions()}
        </div>
      </ScrollContainer>
    );
  }

  renderZendeskLogo = () => {
    return this.props.hideZendeskLogo || this.state.fullscreen
         ? null
         : <ZendeskLogo
             formSuccess={this.state.showNotification}
             rtl={i18n.isRTL()}
             fullscreen={this.state.fullscreen} />;
  }

  renderAttachmentBox = () => {
    return this.state.isDragActive && this.props.attachmentsEnabled
         ? <AttachmentBox
             onDragLeave={this.handleDragLeave}
             dimensions={frameDimensions}
             onDrop={this.handleOnDrop} />
         : null;
  }

  render = () => {
    setTimeout(() => {
      frameDimensions = this.props.updateFrameSize() || frameDimensions;
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
