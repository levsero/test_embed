import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
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
    const { attachment } = this.props;
    const { uploaded, uploading, uploadError } = this.state;

    const doneFn = (response) => {
      // console.log('success');
      const { upload_token } = response.body;

      this.setState({
        uploading: false,
        uploaded: true,
        uploadToken: upload_token
      });
    };
    const failFn = (error) => {
      // console.log('failure');
      const { message } = error;

      this.setState({
        uploading: false,
        uploadError: message
      });
    };
    const progressFn = (e) => {
      // console.log('Percentage done: ', e.percent);
      this.refs.progressBar.style.width = `${Math.floor(e.percent)}%`;
    };

    if (!(uploading || uploaded || uploadError)) {
      const uploadRequest = this.props.attachmentSender(attachment, doneFn, failFn, progressFn);

      this.setState({
        uploading: true,
        uploadRequest: uploadRequest
      });
    }
  }

  handleRemoveAttachment() {
    this.props.handleRemoveAttachment(this.props.attachment);
  }

  handleStopUpload() {
    this.state.uploadRequest.abort();
  }

  render() {
    const { icon, attachment } = this.props;
    const { uploading } = this.state;

    const nameStart = attachment.name.slice(0, -7);
    const nameEnd = attachment.name.slice(-7);

    const containerClasses = classNames({
      'Form-field--display': true,
      'Attachment--uploading': uploading,
      'u-posRelative': true,
      'u-marginBS': true
    });

    const progressBar = uploading ? <div className='Attachment-progress' ref='progressBar' /> : null;
    const iconOnClick = uploading ? this.handleStopUpload : this.handleRemoveAttachment;

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
