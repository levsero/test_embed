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
import { handleFormChange, handleTicketFormClick, handleTicketSubmission } from 'src/redux/modules/submitTicket';
import * as selectors from 'src/redux/modules/submitTicket/submitTicket-selectors';
import { getHasContextuallySearched } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { i18n } from 'service/i18n';
import { isIE } from 'utility/devices';
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
    activeTicketFormFields: selectors.getActiveTicketFormFields(state),
    hasContextuallySearched: getHasContextuallySearched(state)
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
    position: PropTypes.string,
    previewEnabled: PropTypes.bool,
    showBackButton: PropTypes.func,
    style: PropTypes.object,
    subjectEnabled: PropTypes.bool,
    handleTicketSubmission: PropTypes.func.isRequired,
    ticketFieldSettings: PropTypes.array,
    ticketFormSettings: PropTypes.array,
    ticketForms: PropTypes.array.isRequired,
    ticketFormsAvailable: PropTypes.bool.isRequired,
    ticketFieldsAvailable: PropTypes.bool.isRequired,
    ticketFields: PropTypes.object.isRequired,
    updateFrameSize: PropTypes.func,
    handleFormChange: PropTypes.func.isRequired,
    handleTicketFormClick: PropTypes.func.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    activeTicketForm: PropTypes.object,
    searchTerm: PropTypes.string,
    activeTicketFormFields: PropTypes.array,
    hasContextuallySearched: PropTypes.bool
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
    activeTicketFormFields: [],
    hasContextuallySearched: false
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

    const attachments = _.get(this.refs, 'submitTicketForm.refs.attachments');
    const uploads = attachments ? attachments.getAttachmentTokens() : null;

    const failCallback = () => {
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
        searchLocale: i18n.getLocale(),
        contextualSearch: this.props.hasContextuallySearched
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
          email: _.get(this.props.formState, 'email'),
          attachmentsCount: attachmentsList.numUploadedAttachments(),
          attachmentTypes: attachmentTypes
        });
      }

      this.props.onSubmitted(params);
      this.clearForm();
      this.props.updateFrameSize();
    };

    this.props.handleTicketSubmission(uploads, doneCallback, failCallback);
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
        <ScrollContainer title={this.state.message}>
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
  handleTicketFormClick,
  handleTicketSubmission
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(SubmitTicket);
