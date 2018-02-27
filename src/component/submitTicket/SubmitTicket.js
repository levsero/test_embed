import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { locals as styles } from './SubmitTicket.scss';

import { AttachmentBox } from 'component/attachment/AttachmentBox';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { Icon } from 'component/Icon';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { SubmitTicketForm } from 'component/submitTicket/SubmitTicketForm';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { handleFormChange, handleTicketFormClick } from 'src/redux/modules/submitTicket';
import * as selectors from 'src/redux/modules/submitTicket/submitTicket-selectors';
import { i18n } from 'service/i18n';
import { store } from 'service/persistence';
import { isIE } from 'utility/devices';
import { location } from 'utility/globals';
import { getSearchTerm } from 'src/redux/modules/helpCenter/helpCenter-selectors';

const mapStateToProps = (state) => {
  return {
    searchTerm: getSearchTerm(state),
    formState: selectors.getFormState(state),
    loading: selectors.getLoading(state),
    ticketForms: selectors.getTicketForms(state),
    ticketFormsAvailable: selectors.getTicketFormsAvailable(state),
    ticketFields: selectors.getTicketFields(state),
    ticketFieldsAvailable: selectors.getTicketFieldsAvailable(state),
    activeTicketForm: selectors.getActiveTicketForm(state),
    activeTicketFormFields: selectors.getActiveTicketFormFields(state)
  };
};

class SubmitTicket extends Component {
  static propTypes = {
    attachmentsEnabled: PropTypes.bool,
    attachmentSender: PropTypes.func.isRequired,
    formTitleKey: PropTypes.string.isRequired,
    formState: PropTypes.object.isRequired,
    getFrameDimensions: PropTypes.func.isRequired,
    hideZendeskLogo: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    maxFileCount: PropTypes.number,
    maxFileSize: PropTypes.number,
    onCancel: PropTypes.func,
    onSubmitted: PropTypes.func,
    newDesign: PropTypes.bool,
    position: PropTypes.string,
    previewEnabled: PropTypes.bool,
    showBackButton: PropTypes.func,
    style: PropTypes.object,
    subjectEnabled: PropTypes.bool,
    submitTicketSender: PropTypes.func,
    tags: PropTypes.array,
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    ticketForms: PropTypes.array.isRequired,
    ticketFormsAvailable: PropTypes.bool.isRequired,
    ticketFieldsAvailable: PropTypes.bool.isRequired,
    ticketFields: PropTypes.object.isRequired,
    updateFrameSize: PropTypes.func,
    handleFormChange: PropTypes.func.isRequired,
    handleTicketFormClick: PropTypes.func.isRequired,
    viaId: PropTypes.number.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    activeTicketForm: PropTypes.object,
    searchTerm: PropTypes.string,
    activeTicketFormFields: PropTypes.array
  };

  static defaultProps = {
    attachmentsEnabled: false,
    hideZendeskLogo: false,
    formTitleKey: 'message',
    handleTicketFormClick: () => {},
    maxFileCount: 5,
    maxFileSize: 5 * 1024 * 1024,
    onCancel: () => {},
    onSubmitted: () => {},
    newDesign: false,
    position: 'right',
    previewEnabled: false,
    showBackButton: () => {},
    style: null,
    subjectEnabled: false,
    tags: [],
    ticketFieldSettings: [],
    ticketFormSettings: [],
    ticketForms: [],
    ticketFormsAvailable: false,
    ticketFields: {},
    activeTicketForm: null,
    updateFrameSize: () => {},
    activeTicketFormFields: []
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      errorMessage: null,
      formTitleKey: props.formTitleKey,
      isDragActive: false,
      message: '',
      showNotification: false
    };
  }

  clearNotification = () => {
    this.setState({ showNotification: false });
  }

  clearForm = () => {
    const { ticketFormsAvailable, ticketForms } = this.props;

    this.refs.submitTicketForm.clear();

    if (ticketFormsAvailable && ticketForms.length > 1) {
      this.props.handleTicketFormClick(null);
    }
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
        searchTerm: this.props.searchTerm,
        searchLocale: i18n.getLocale()
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
    return _.find(this.props.ticketFields, (field) => {
      return field.type === fieldType && field.removable === false;
    });
  }

  formatRequestTicketData = (data) => {
    const { name, email } = data.value;
    const { ticketFormsAvailable, ticketFieldsAvailable } = this.props;
    const formatNameFromEmail = (email) => {
      const localPart = email.split('@', 2)[0];
      const newName = localPart.split(/[._]/);

      return _.map(newName, _.capitalize).join(' ');
    };
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
        'name': name || formatNameFromEmail(email),
        'email': email,
        'locale_id': i18n.getLocaleId()
      },
      'ticket_form_id': ticketFormsAvailable ? this.props.activeTicketForm.id : null
    };

    return ticketFieldsAvailable || ticketFormsAvailable
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

  updateTicketFields = () => {
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

  setTicketForm = (ticketFormId) => {
    const { ticketForms, ticketFormsAvailable } = this.props;

    if (!ticketFormsAvailable) return;

    const getformByIdFn = (form) => form.id === parseInt(ticketFormId);
    const activeTicketForm = _.find(ticketForms, getformByIdFn);

    this.props.showBackButton();
    this.props.handleTicketFormClick(activeTicketForm);
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
        fullscreen={this.props.fullscreen}
        newDesign={this.props.newDesign}
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
      <div className={styles.error}>
        <Icon type='Icon--error' className={styles.errorIcon} />
        {this.state.errorMessage}
      </div>
    );
  }

  renderForm = () => {
    const { activeTicketForm, ticketFormSettings, activeTicketFormFields, ticketFields } = this.props;
    const getformByIdFn = (form) => parseInt(form.id) === parseInt(activeTicketForm.id);
    const activeTicketFormSettings = activeTicketForm ? _.find(ticketFormSettings, getformByIdFn) : {};
    const activeTicketFormPrefill = _.get(activeTicketFormSettings, 'fields', []);
    const fields = (activeTicketForm) ? activeTicketFormFields : ticketFields;

    return (
      <SubmitTicketForm
        ref='submitTicketForm'
        onCancel={this.props.onCancel}
        fullscreen={this.props.fullscreen}
        hide={this.state.showNotification}
        ticketFields={fields}
        formTitleKey={this.state.formTitleKey}
        attachmentSender={this.props.attachmentSender}
        attachmentsEnabled={this.props.attachmentsEnabled}
        subjectEnabled={this.props.subjectEnabled}
        maxFileCount={this.props.maxFileCount}
        maxFileSize={this.props.maxFileSize}
        formState={this.props.formState}
        setFormState={this.props.handleFormChange}
        ticketFormSettings={activeTicketFormPrefill}
        ticketFieldSettings={this.props.ticketFieldSettings}
        submit={this.handleSubmit}
        newDesign={this.props.newDesign}
        activeTicketForm={this.props.activeTicketForm}
        getFrameDimensions={this.props.getFrameDimensions}
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
        <ScrollContainer title={this.state.message} newDesign={this.props.newDesign}>
          <Icon
            type='Icon--tick'
            className={iconClasses} />
        </ScrollContainer>
      </div>
    );
  }

  renderTicketFormOptions = () => {
    const { ticketForms } = this.props;
    const mobileClasses = this.props.fullscreen ? styles.ticketFormsListMobile : '';

    return _.map(ticketForms, (form, key) => {
      return (
        <div key={key} data-id={form.id} className={`${styles.ticketFormsList} u-userTextColor ${mobileClasses}`}>
          {form.display_name}
        </div>
      );
    });
  }

  renderTicketFormList = () => {
    if (this.state.showNotification) return;

    const { fullscreen } = this.props;
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
        newDesign={this.props.newDesign}
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
    return this.props.hideZendeskLogo || this.props.fullscreen
         ? null
         : <ZendeskLogo
             formSuccess={this.state.showNotification}
             rtl={i18n.isRTL()}
             fullscreen={this.props.fullscreen} />;
  }

  renderAttachmentBox = () => {
    return this.state.isDragActive && this.props.attachmentsEnabled
         ? <AttachmentBox
             onDragLeave={this.handleDragLeave}
             dimensions={this.props.getFrameDimensions()}
             onDrop={this.handleOnDrop} />
         : null;
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    const content = (_.isEmpty(this.props.ticketForms) || this.props.activeTicketForm)
                  ? this.renderForm()
                  : this.renderTicketFormList();
    const display = this.props.loading
                  ? this.renderLoadingSpinner()
                  : content;

    return (
      <div>
        {this.renderAttachmentBox()}
        {this.renderNotifications()}
        {display}
        {this.renderZendeskLogo()}
      </div>
    );
  }
}

const actionCreators = {
  handleFormChange,
  handleTicketFormClick
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(SubmitTicket);
