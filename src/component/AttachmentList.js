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
      attachments: {},
      errorMessage: null
    };
  }

  handleOnDrop(files) {
    const { maxFileLimit, maxFileSize } = this.props;
    const numAttachments = _.size(this.state.attachments);
    const numFilesToAdd = maxFileLimit - numAttachments;
    const setLimitError = () => {
      const errorMessage = i18n.t('embeddable_framework.submitTicket.attachments.error.limit', {
        maxFiles: maxFileLimit
      });

      this.setState({ errorMessage });
    };

    if (numAttachments >= maxFileLimit) {
      setLimitError();
      return;
    }

    // This check is needed so that we can fill the remaining space for attachments regardless of
    // whether or not they go over the limit. If they do we notify them by displaying the limit error.
    if (numAttachments + files.length > maxFileLimit) {
      setLimitError();
    }

    const createAttachmentFn = (file) => {
      const maxSize = Math.round(maxFileSize / 1024 / 1024);
      const errorMessage = (file.size >= maxFileSize)
                         ? i18n.t('embeddable_framework.submitTicket.attachments.error.size', { maxSize })
                         : null;

      setTimeout(() => this.createAttachment(file, errorMessage), 0);
    };

    _.chain(files)
      .slice(0, numFilesToAdd)
      .forEach(createAttachmentFn)
      .value();

    setTimeout(this.props.updateForm, 0);
  }

  handleRemoveAttachment(attachmentId) {
    this.setState({
      attachments: _.omit(this.state.attachments, attachmentId),
      errorMessage: null
    });

    setTimeout(this.props.updateForm, 0);
  }

  createAttachment(file, errorMessage) {
    const attachmentId = _.uniqueId();
    const attachment = {
      file: file,
      uploading: true,
      uploadProgress: 0,
      uploadRequestSender: {},
      errorMessage,
      uploadToken: null
    };

    const doneFn = (response) => {
      const token = JSON.parse(response.text).upload.token;

      this.updateAttachmentState(attachmentId, {
        uploading: false,
        uploadToken: token
      });

      setTimeout(this.props.updateForm, 0);
    };
    const failFn = (error) => {
      this.updateAttachmentState(attachmentId, {
        uploading: false,
        errorMessage: error.message
      });

      setTimeout(this.props.updateForm, 0);
    };
    const progressFn = (event) => {
      this.updateAttachmentState(attachmentId, { uploadProgress: event.percent });
    };

    this.setState({
      attachments: _.extend({}, this.state.attachments, { [attachmentId]: attachment })
    });

    setTimeout(() => {
      if (!errorMessage) {
        this.updateAttachmentState(attachmentId, {
          uploadRequestSender: this.props.attachmentSender(file, doneFn, failFn, progressFn)
        });
      } else {
        failFn({ message: errorMessage });
      }
    }, 0);
  }

  updateAttachmentState(attachmentId, newState = {}) {
    const attachment = _.extend({}, this.state.attachments[attachmentId], newState);

    this.setState({
      attachments: _.extend({}, this.state.attachments, { [attachmentId]: attachment })
    });
  }

  getAttachmentTokens() {
    return _.map(this.state.attachments, (a) => a.uploadToken);
  }

  numValidAttachments() {
    return _.chain(this.state.attachments)
            .filter((a) => !a.uploading && !a.errorMessage)
            .size()
            .value();
  }

  attachmentsReady() {
    return this.numValidAttachments() === _.size(this.state.attachments);
  }

  renderAttachments() {
    return _.map(this.state.attachments, (attachment, id) => {
      const { file } = attachment;

      if (file && file.name && file.name.indexOf('.') > -1) {
        const extension = file.name.split('.').pop();
        const icon = iconMapper[extension] || 'Icon--preview-default';

        return (
          <Attachment
            key={id}
            attachmentId={id}
            file={file}
            errorMessage={attachment.errorMessage}
            uploading={attachment.uploading}
            uploadProgress={attachment.uploadProgress}
            icon={icon}
            handleRemoveAttachment={this.handleRemoveAttachment}
            uploadRequestSender={attachment.uploadRequestSender} />
        );
      }
    });
  }

  renderErrorMessage() {
    return (
      <p className='Error u-marginTL'>
        {this.state.errorMessage}
      </p>
    );
  }

  render() {
    const numAttachments = this.numValidAttachments();
    const title = (numAttachments > 0)
                ? i18n.t('embeddable_framework.submitTicket.attachments.title_withCount',
                    { count: numAttachments }
                  )
                : i18n.t('embeddable_framework.submitTicket.attachments.title');
    const errorMessage = this.state.errorMessage ? this.renderErrorMessage() : null;
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
