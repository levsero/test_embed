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
      uploadRequest: () => {}
    };
  }

  componentWillMount() {
    const { attachment, attachmentSender } = this.props;
    const { uploaded, uploading, uploadError } = this.state;

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

    if (!(uploading || uploaded || uploadError)) {
      this.setState({
        uploading: true,
        uploadRequest: attachmentSender(attachment, doneFn, failFn, progressFn)
      });
    }
  }

  handleRemoveAttachment() {
    this.props.handleRemoveAttachment(this.props.attachment);
  }

  handleStopUpload() {
    this.state.uploadRequest.abort();
  }

  renderProgressBar() {
    return (
      <div
        className='Attachment-progress u-vsizeAll u-posAbsolute u-posStart--flush u-posStart--vertFlush'
        ref='progressBar' />
    );
  }

  render() {
    const { icon, attachment } = this.props;
    const { uploading } = this.state;

    const containerClasses = classNames({
      'Form-field--display': true,
      'Attachment--uploading': uploading,
      'u-posRelative': true,
      'u-marginBS': true
    });

    const progressBar = uploading ? this.renderProgressBar() : null;
    const iconOnClick = uploading ? this.handleStopUpload : this.handleRemoveAttachment;
    const nameStart = attachment.name.slice(0, -7);
    const nameEnd = attachment.name.slice(-7);

    return (
      <div className={containerClasses}>
        <div className='Attachment-preview u-posRelative u-hsizeAll'>
          <Icon type={icon} className='Icon--preview u-pullLeft' />
          <div className='Attachment-preview-name u-alignTop u-pullLeft u-textTruncate'>
            {nameStart}
          </div>
          <div className='u-pullLeft'>
            {nameEnd}
          </div>
          <div className='u-pullRight'>
            <Icon
              onClick={iconOnClick}
              className='u-isActionable'
              type='Icon--clearInput' />
          </div>
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
