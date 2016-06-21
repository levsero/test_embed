import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { Attachment } from 'component/Attachment';
import { ButtonDropzone } from 'component/Button';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

const iconMapper = {
  'pdf': 'Icon--preview-pdf',
  'img': 'Icon--preview-img',
  'png': 'Icon--preview-img',
  'gif': 'Icon--preview-img',
  'jpeg': 'Icon--preview-img',
  'jpg': 'Icon--preview-img',
  'docx': 'Icon--preview-doc',
  'doc': 'Icon--preview-doc',
  'key': 'Icon--preview-key',
  'numbers': 'Icon--preview-num',
  'pptx': 'Icon--preview-ppt',
  'ppt': 'Icon--preview-ppt',
  'pages': 'Icon--preview-pag',
  'rtf': 'Icon--preview-txt',
  'txt': 'Icon--preview-txt',
  'xlsx': 'Icon--preview-xls',
  'xls': 'Icon--preview-xls'
};

export class AttachmentList extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, AttachmentList.prototype);

    this.state = {
      attachments: [],
      errorMessage: null
    };
  }

  handleOnDrop(files) {
    const { maxFileLimit, maxFileSize } = this.props;
    const numFilesToAdd = maxFileLimit - this.state.attachments.length;
    const setLimitError = () => {
      const errorMessage = i18n.t('embeddable_framework.submitTicket.attachments.error.limit', {
        maxFiles: maxFileLimit
      });

      this.setState({ errorMessage });
    };

    if (this.state.errorMessage) {
      this.setState({ errorMessage: null });
    }

    if (numFilesToAdd < 1) {
      setLimitError();
      return;
    }

    const mapFile = (file) => {
      const fileObj = {
        id: _.uniqueId(),
        file: file,
        uploadToken: null
      };

      if (file.size > maxFileSize) {
        const maxFileSizeInMB = Math.round(maxFileSize / 1024 / 1024);
        const message = i18n.t('embeddable_framework.submitTicket.attachments.error.size', {
          maxSize: maxFileSizeInMB
        });

        _.extend(fileObj, { error: { message } });
      }

      return fileObj;
    };

    const newFiles = _.chain(files)
      .slice(0, numFilesToAdd)
      .map(mapFile)
      .value();

    if (this.state.attachments.length + files.length > maxFileLimit) {
      setLimitError();
    }

    this.setState({
      attachments: _.union(this.state.attachments, newFiles)
    });
    this.props.updateForm();
  }

  handleOnUpload(attachmentId, token) {
    let attachment = _.find(this.state.attachments, (a) => a.id === attachmentId);

    attachment.uploadToken = token;
  }

  getAttachmentTokens() {
    return _.map(this.state.attachments, (a) => a.uploadToken);
  }

  handleRemoveAttachment(attachmentId) {
    this.setState({
      attachments: _.reject(this.state.attachments, (a) => a.id === attachmentId),
      errorMessage: null
    });

    setTimeout(() => this.props.updateForm(), 0);
  }

  renderAttachments() {
    return _.map(this.state.attachments, (attachment) => {
      const { id, file } = attachment;

      if (file && file.name && file.name.indexOf('.') > -1) {
        const extension = file.name.split('.').pop();
        const icon = iconMapper[extension] || 'Icon--preview-default';

        return (
          <Attachment
            ref={id}
            key={id}
            attachment={attachment}
            handleOnUpload={this.handleOnUpload}
            icon={icon}
            handleRemoveAttachment={this.handleRemoveAttachment}
            attachmentSender={this.props.attachmentSender}
            updateAttachmentsList={this.props.updateForm} />
        );
      }
    });
  }

  attachmentsReady() {
    const unreadyAttachment = _.find(this.refs, (attachment) => {
      return attachment.state.uploadError || attachment.state.uploading;
    });

    return !unreadyAttachment;
  }

  renderErrorMessage() {
    return (
      <p className='Error u-marginTL'>
        {this.state.errorMessage}
      </p>
    );
  }

  render() {
    const numAttachments = this.state.attachments.length;
    const title = (numAttachments > 0)
                ? i18n.t('embeddable_framework.submitTicket.attachments.title_withCount',
                    { count: numAttachments }
                  )
                : i18n.t('embeddable_framework.submitTicket.attachments.title');
    const errorMessage = this.state.errorMessage ? this.renderAttachments() : null;
    const attachmentComponents = this.renderAttachments();

    return (
      <div>
        {errorMessage}
        <div className='Form-fieldContainer u-block u-marginVM'>
          <label className='Form-fieldLabel u-textXHeight'>
            {title}
          </label>
          {attachmentComponents}
          <ButtonDropzone
            onDrop={this.handleOnDrop}
            isMobile={this.props.fullscreen} />
        </div>
      </div>
    );
  }
}

AttachmentList.propTypes = {
  attachmentSender: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  maxFileLimit: PropTypes.number.isRequired,
  maxFileSize: PropTypes.number.isRequired,
  fullscreen: PropTypes.bool
};

AttachmentList.defaultProps = {
  fullscreen: false
};
