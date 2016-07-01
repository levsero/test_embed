import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

export class Attachment extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, Attachment.prototype);
  }

  componentWillReceiveProps(nextProps) {
    const { progressBar } = this.refs;

    if (progressBar) {
      progressBar.style.width = `${Math.floor(nextProps.uploadProgress)}%`;
    }
  }

  handleIconClick() {
    if (this.props.uploading) {
      this.props.uploadRequestSender.abort();
    }

    this.props.handleRemoveAttachment(this.props.attachmentId);
  }

  formatAttachmentSize(bytes) {
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

  renderProgressBar() {
    return (
      <div
        className='Attachment-progress u-vsizeAll u-posAbsolute u-posStart--flush u-posStart--vertFlush'
        ref='progressBar' />
    );
  }

  render() {
    const { file, errorMessage, uploading } = this.props;
    const hasError = !!errorMessage;
    const containerClasses = classNames({
      'Form-field--display-preview': true,
      'Attachment--uploading': uploading,
      'u-posRelative': true,
      'u-marginBS': true,
      'u-borderError': hasError
    });
    const secondaryTextClasses = classNames({
      'u-pullLeft': true,
      'u-clearLeft': true,
      'u-textError': hasError
    });

    const icon = hasError
               ? null
               : <Icon type={this.props.icon} className='Icon--preview u-pullLeft' />;
    const progressBar = uploading && !hasError
                      ? this.renderProgressBar()
                      : null;

    const nameStart = file.name.slice(0, -7);
    const nameEnd = file.name.slice(-7);
    const secondaryText = (hasError) ? errorMessage : this.formatAttachmentSize(file.size);

    return (
      <div className={containerClasses}>
        <div className='Attachment-preview u-posRelative u-hsizeAll'>
          {icon}
          <div className="u-pullLeft">
            <div className='Attachment-preview-name u-alignTop u-pullLeft u-textTruncate u-textBody'>
              {nameStart}
            </div>
            <div className='u-pullLeft u-textBody'>
              {nameEnd}
            </div>
            <div className={secondaryTextClasses}>
              {secondaryText}
            </div>
          </div>
          <Icon
            onClick={this.handleIconClick}
            className='Icon--preview-close u-isActionable u-pullRight'
            type='Icon--close' />
        </div>
        {progressBar}
      </div>
    );
  }
}

Attachment.propTypes = {
  attachmentId: PropTypes.string.isRequired,
  file: PropTypes.object.isRequired,
  uploading: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
  handleRemoveAttachment: PropTypes.func.isRequired,
  uploadProgress: PropTypes.number,
  errorMessage: PropTypes.string,
  uploadRequestSender: PropTypes.object
};

Attachment.defaultProps = {
  uploadProgress: 0,
  errorMessage: '',
  uploadRequestSender: {}
};
