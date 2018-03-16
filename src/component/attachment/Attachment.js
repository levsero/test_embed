import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sharedPropTypes from 'types/shared';
import _ from 'lodash';

import { Icon } from 'component/Icon';
import { ProgressBar } from 'component/attachment/ProgressBar';
import { i18n } from 'service/i18n';
import { locals as styles } from './Attachment.scss';
import classNames from 'classnames';

export class Attachment extends Component {
  static propTypes = {
    attachmentId: PropTypes.string.isRequired,
    className: PropTypes.string,
    downloading: PropTypes.bool,
    errorMessage: PropTypes.string,
    fakeProgress: PropTypes.bool,
    file: sharedPropTypes.file,
    filenameMaxLength: PropTypes.number,
    handleRemoveAttachment: PropTypes.func,
    isDownloadable: PropTypes.bool.isRequired,
    isRemovable: PropTypes.bool.isRequired,
    icon: PropTypes.string.isRequired,
    uploading: PropTypes.bool.isRequired,
    uploadProgress: PropTypes.number,
    uploadRequestSender: PropTypes.object
  };

  static defaultProps = {
    attachmentId: '',
    downloading: false,
    fakeProgress: false,
    isDownloadable: false,
    isRemovable: false,
    uploading: false,
    uploadProgress: 0,
    uploadRequestSender: {}
  };

  handleIconClick = () => {
    if (this.props.uploading) {
      this.props.uploadRequestSender.abort();
    }

    this.props.handleRemoveAttachment(this.props.attachmentId);
  }

  formatAttachmentSize = (bytes) => {
    // if the size of the file is less than 1KB, just round it up
    const size = _.max([bytes, 1000]);

    return size >= 1000000
           ? i18n.t('embeddable_framework.submitTicket.attachments.size_megabyte',
             { size: _.floor(size / 1000000, 1) })
           : i18n.t('embeddable_framework.submitTicket.attachments.size_kilobyte',
             { size: _.floor(size / 1000) });
  }

  truncateFilename = (filename, filenameMaxLength, trailingCharsLength) => {
    if (filename.length <= filenameMaxLength) return filename;

    const nameStart = filename.slice(0, (filenameMaxLength - trailingCharsLength) - 1);
    const nameEnd = filename.slice(-trailingCharsLength);

    return `${nameStart}…${nameEnd}`;
  }

  renderLinkedEl = (el, url) => {
    return (
      <a className={styles.link} target="_blank" href={url}>{el}</a>
    );
  }

  renderSecondaryText(file, errorMessage, isDownloadable, downloading, uploading) {
    const attachmentSize = this.formatAttachmentSize(file.size);
    const downloadLink = (
      <div>
        <span className={styles.downloadSize}>{attachmentSize}</span>
        <span className={styles.downloadText}>{i18n.t('embeddable_framework.chat.chatLog.attachmentDownload')}</span>
      </div>
    );
    let secondaryText;

    if (errorMessage) {
      secondaryText = errorMessage;
    } else if (uploading) {
      secondaryText = i18n.t('embeddable_framework.chat.chatLog.uploading');
    } else if (downloading) {
      secondaryText = i18n.t('embeddable_framework.chat.chatLog.loadingImage', { attachmentSize });
    } else if (isDownloadable) {
      secondaryText = this.renderLinkedEl(downloadLink, file.url);
    } else {
      secondaryText = attachmentSize;
    }

    return secondaryText;
  }

  render() {
    const { file,
            downloading,
            errorMessage,
            filenameMaxLength,
            isDownloadable,
            uploading } = this.props;

    const containerClasses = classNames(
      styles.container,
      this.props.className,
      { [styles.containerError]: !!errorMessage }
    );

    const secondaryTextClasses = classNames(
      styles.secondaryText,
      { [styles.secondaryTextError]: !!errorMessage }
    );

    const previewIcon = <Icon type={this.props.icon} className={styles.iconPreview} />;

    const previewName = (
      <div className={styles.previewName}>
        {filenameMaxLength ? this.truncateFilename(file.name, filenameMaxLength, 7) : file.name}
      </div>
    );

    const removeIcon = (
      <Icon
        onClick={this.handleIconClick}
        className={styles.icon}
        type='Icon--close' />
    );

    const progressBar = (
      <ProgressBar
        percentLoaded={this.props.uploadProgress}
        fakeProgress={this.props.fakeProgress}
      />
    );

    return (
      <div className={containerClasses}>
        <div className={styles.preview}>
          {isDownloadable ? this.renderLinkedEl(previewIcon, file.url) : previewIcon}
          <div className={styles.description}>
            {isDownloadable ? this.renderLinkedEl(previewName, file.url) : previewName}
            <div className={secondaryTextClasses}>
              {this.renderSecondaryText(
                file,
                errorMessage,
                isDownloadable,
                downloading,
                uploading)
              }
            </div>
          </div>
          {this.props.isRemovable && removeIcon}
        </div>
        {(uploading && !errorMessage) && progressBar}
      </div>
    );
  }
}
