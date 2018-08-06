import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sharedPropTypes from 'types/shared';
import _ from 'lodash';

import { Icon } from 'component/Icon';
import { ProgressBar } from 'component/attachment/ProgressBar';
import { Alert, Title, Close } from '@zendeskgarden/react-notifications';
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
    icon: PropTypes.string,
    uploading: PropTypes.bool.isRequired,
    uploadProgress: PropTypes.number,
    uploadRequestSender: PropTypes.object
  };

  static defaultProps = {
    attachmentId: '',
    downloading: false,
    fakeProgress: false,
    icon: '',
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

  renderSecondaryText(file, isDownloadable, downloading, uploading) {
    const attachmentSize = this.formatAttachmentSize(file.size);
    const downloadLink = (
      <div>
        <span className={styles.downloadSize}>{attachmentSize}</span>
        <span className={styles.downloadText}>{i18n.t('embeddable_framework.chat.chatLog.attachmentDownload')}</span>
      </div>
    );
    let secondaryText;

    if (uploading) {
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

  previewNameString = () => {
    const { file, filenameMaxLength } = this.props;

    return filenameMaxLength ? this.truncateFilename(file.name, filenameMaxLength, 7) : file.name;
  }

  renderPreviewIcon = () => {
    const { file, isDownloadable } = this.props;

    const previewIcon = this.props.icon.length > 0
      ? <Icon type={this.props.icon} className={styles.iconPreview} />
      : null;

    if (isDownloadable && !!previewIcon) return this.renderLinkedEl(previewIcon, file.url);

    return previewIcon;
  }

  renderAttachmentBox() {
    const { file,
      downloading,
      errorMessage,
      isDownloadable,
      uploading } = this.props;

    if (errorMessage) return;

    const previewName = (
      <div className={styles.previewName}>
        {this.previewNameString()}
      </div>
    );

    const removeIcon = (
      <Icon
        onClick={this.handleIconClick}
        className={styles.icon}
        type='Icon--close' />
    );

    const containerClasses = classNames(
      styles.container,
      this.props.className
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
          {this.renderPreviewIcon()}
          <div className={styles.description}>
            {isDownloadable ? this.renderLinkedEl(previewName, file.url) : previewName}
            <div className={styles.secondaryText}>
              {this.renderSecondaryText(
                file,
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

  renderAttachmentError() {
    const { errorMessage } = this.props;

    if (!errorMessage) return;

    return (
      <Alert type="error" className={styles.containerError}>
        <Title className={styles.previewError}>{this.previewNameString()}</Title>
        <div className={styles.secondaryTextError}>{errorMessage}</div>
        <Close onClick={this.handleIconClick} />
      </Alert>
    );
  }

  render() {
    return (
      <div>
        {this.renderAttachmentBox()}
        {this.renderAttachmentError()}
      </div>
    );
  }
}
