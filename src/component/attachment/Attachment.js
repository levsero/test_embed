import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { locals as styles } from './Attachment.scss';

export class Attachment extends Component {
  static propTypes = {
    attachmentId: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
    file: PropTypes.object.isRequired,
    handleRemoveAttachment: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    uploading: PropTypes.bool.isRequired,
    uploadProgress: PropTypes.number,
    uploadRequestSender: PropTypes.object
  };

  static defaultProps = {
    errorMessage: '',
    uploadProgress: 0,
    uploadRequestSender: {}
  };

  componentWillReceiveProps = (nextProps) => {
    const { progressBar } = this.refs;

    if (progressBar) {
      progressBar.style.width = `${Math.floor(nextProps.uploadProgress)}%`;
    }
  }

  handleIconClick = () => {
    if (this.props.uploading) {
      this.props.uploadRequestSender.abort();
    }

    this.props.handleRemoveAttachment(this.props.attachmentId);
  }

  formatAttachmentSize = (bytes) => {
    // If the size of the file is less than 1KB, just round it up.
    const size = Math.max(bytes, 1000);

    return size >= 1000000
           ? i18n.t('embeddable_framework.submitTicket.attachments.size_megabyte',
             {
               size: _.floor(size / 1000000, 1),
               fallback: '%(size)s MB'
             })
           : i18n.t('embeddable_framework.submitTicket.attachments.size_kilobyte',
             {
               size: _.floor(size / 1000),
               fallback: '%(size)s KB'
             });
  }

  renderProgressBar = () => {
    return <div className={styles.progress} ref='progressBar' />;
  }

  render = () => {
    const { file, errorMessage, uploading } = this.props;
    const hasError = !!errorMessage;
    const containerUploadingStyles = uploading ? styles.uploading : '';
    const containerErrorStyles = hasError ? styles.containerError : '';
    const containerStyles = `${styles.container} ${containerUploadingStyles} ${containerErrorStyles}`;
    const secondaryTextErrorStyles = hasError ? styles.secondaryTextError : '';
    const secondaryTextStyles = `${styles.secondaryText} ${secondaryTextErrorStyles}`;
    const progressBar = uploading && !hasError
                      ? this.renderProgressBar()
                      : null;
    const nameStart = file.name.slice(0, -7);
    const nameEnd = file.name.slice(-7);
    const secondaryText = hasError ? errorMessage : this.formatAttachmentSize(file.size);

    return (
      <div className={containerStyles}>
        <div className={styles.preview}>
          <Icon type={this.props.icon} className={styles.iconPreview} />
          <div className={styles.title}>
            <div className={styles.previewNameLeft}>
              {nameStart}
            </div>
            <div className={styles.previewNameRight}>
              {nameEnd}
            </div>
            <div className={secondaryTextStyles}>
              {secondaryText}
            </div>
          </div>
          <Icon
            onClick={this.handleIconClick}
            className={styles.icon}
            type='Icon--close' />
        </div>
        {progressBar}
      </div>
    );
  }
}
