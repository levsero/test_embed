import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { bindMethods } from 'utility/utils';

export class Attachment extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, Attachment.prototype);

    this.state = {
      uploaded: false,
      uploading: false,
      uploadToken: null,
      uploadError: null,
      uploadRequestSender: () => {}
    };
  }

  componentWillMount() {
    const { attachment, attachmentSender } = this.props;

    const doneFn = (response) => {
      this.setState({
        uploading: false,
        uploaded: true,
        uploadToken: response.body.upload_token
      });
    };
    const failFn = (error) => {
      this.setState({
        uploading: false,
        uploadError: error.message
      });
    };
    const progressFn = (event) => {
      const { progressBar } = this.refs;

      progressBar.style.width = `${Math.floor(event.percent)}%`;
    };

    this.setState({
      uploading: true,
      uploadRequestSender: attachmentSender(attachment.file, doneFn, failFn, progressFn)
    });
  }

  handleRemoveAttachment() {
    this.props.handleRemoveAttachment(this.props.attachment.id);
  }

  handleStopUpload() {
    this.state.uploadRequestSender.abort();
  }

  renderProgressBar() {
    return (
      <div
        className='Attachment-progress u-vsizeAll u-posAbsolute u-posStart--flush u-posStart--vertFlush'
        ref='progressBar' />
    );
  }

  render() {
    const { file } = this.props.attachment;

    const containerClasses = classNames({
      'Form-field--display-preview': true,
      'Attachment--uploading': this.state.uploading,
      'u-posRelative': true,
      'u-marginBS': true
    });

    const progressBar = this.state.uploading ? this.renderProgressBar() : null;
    const iconOnClick = this.state.uploading ? this.handleStopUpload : this.handleRemoveAttachment;
    const nameStart = file.name.slice(0, -7);
    const nameEnd = file.name.slice(-7);
    const sizeInMb = Math.round((file.size / 1024 / 1024) * 10) / 10;
    const size = `${sizeInMb} mb`;

    return (
      <div className={containerClasses}>
        <div className='Attachment-preview u-posRelative u-hsizeAll'>
          <Icon type={this.props.icon} className='Icon--preview u-pullLeft' />
          <div className="u-pullLeft">
            <div className='Attachment-preview-name u-alignTop u-pullLeft u-textTruncate u-textBody'>
              {nameStart}
            </div>
            <div className='u-pullLeft u-textBody'>
              {nameEnd}
            </div>
            <div className='u-pullLeft u-clearLeft'>
              {size}
            </div>
          </div>
          <Icon
            onClick={iconOnClick}
            className='u-isActionable u-pullRight'
            type='Icon--preview-close' />
        </div>
        {progressBar}
      </div>
    );
  }
}

Attachment.propTypes = {
  attachment: PropTypes.object.isRequired,
  handleRemoveAttachment: PropTypes.func.isRequired,
  attachmentSender: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired
};
