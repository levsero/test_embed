import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { Icon } from 'component/Icon';

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

const getAttachmentPreviews = (attachments, removeAttachment) => {
  const previews = _.map(attachments, (attachment) => {
    const extension = attachment.name.split('.').pop();
    const icon = iconMapper[extension] || 'Icon--preview-default';

    return (<AttachmentPreview
             attachment={attachment}
             handleRemoveAttachment={removeAttachment}
             icon={icon} />);
  });

  return previews;
};

class AttachmentPreview extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.handleRemoveAttachment(this.props.attachment);
  }

  render() {
    const name = this.props.attachment.name;
    const nameStart = name.slice(0, -7);
    const nameEnd = name.slice(-7);

    return (
      <div className='Form-field--display u-marginBS'>
        <div className='Form-field--attachments'>
          <Icon type={this.props.icon} className='Icon--preview u-pullLeft' />
          <div className='u-alignTop u-pullLeft u-textTruncate attachmentPreviewName'>
            {nameStart}
          </div>
          <div className='u-pullLeft'>
            {nameEnd}
          </div>
          <div className='u-pullRight'>
            <Icon
              onClick={this.handleClick}
              className='u-isActionable'
              type='Icon--clearInput' />
          </div>
        </div>
      </div>
    );
  }
}

AttachmentPreview.propTypes = {
  attachment: PropTypes.object.isRequired,
  handleRemoveAttachment: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired
};

export {
  AttachmentPreview,
  getAttachmentPreviews
};
