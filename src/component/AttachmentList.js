import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

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
      errorMessage: '',
      errorCount: 0
    };
  }

  handleOnDrop(files) {
    const maxFileLimit = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5 mb
    const numFilesToAdd = maxFileLimit - this.state.attachments.length;
    const setLimitError = () => {
      this.setState({
        errorMessage: 'You have already reached the limit of 5 attachments.'
      });
    };

    if (this.state.errorMessage) {
      this.setState({ errorMessage: '' });
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
        _.extend(fileObj, {
          error: { message: `The file exceeds the 5 mb limit.` }
        });
        this.addAttachmentError();
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

  handleRemoveAttachment(attachmentId, attachmentError) {
    if (attachmentError) {
      this.setState({ errorCount: this.state.errorCount - 1 });

      setTimeout(() => this.props.updateForm(), 1);
    }

    this.setState({
      attachments: _.reject(this.state.attachments, (a) => a.id === attachmentId),
      errorMessage: ''
    });
  }

  renderAttachments() {
    return _.map(this.state.attachments, (attachment) => {
      const { id, file } = attachment;

      if (file && file.name && file.name.indexOf('.') > -1) {
        const extension = file.name.split('.').pop();
        const icon = iconMapper[extension] || 'Icon--preview-default';

        return (
          <Attachment
            key={id}
            attachment={attachment}
            handleOnUpload={this.handleOnUpload}
            handleRemoveAttachment={this.handleRemoveAttachment}
            attachmentSender={this.props.attachmentSender}
            icon={icon}
            error={attachment.error}
            addAttachmentError={this.addAttachmentError} />
        );
      }
    });
  }

  addAttachmentError() {
    this.setState({ errorCount: this.state.errorCount + 1 });
    this.props.updateForm();
  }

  render() {
    const errorClasses = classNames({
      'Error u-marginTL': true,
      'u-isHidden': !this.state.errorMessage
    });
    const numAttachments = this.state.attachments.length;
    const title = (numAttachments > 0)
                ? i18n.t('embeddable_framework.submitTicket.attachments.title_withCount',
                    { fallback: 'Attachments (%(count)s)',
                    count: numAttachments }
                  )
                : i18n.t('embeddable_framework.submitTicket.attachments.title',
                    { fallback: 'Attachments' }
                  );
    const attachmentComponents = this.renderAttachments();

    return (
      <div>
        <p className={errorClasses}>
          {this.state.errorMessage}
        </p>
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
  fullscreen: PropTypes.bool
};

AttachmentList.defaultProps = {
  fullscreen: false
};
