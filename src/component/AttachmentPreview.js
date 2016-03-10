import React, { Component, PropTypes } from 'react';
import { map } from 'lodash';

import { Icon } from 'component/Icon';

const getAttachmentPreviews = (attachments, removeAttachment) => {
  const previews = map(attachments, function(attachment) {
    return <AttachmentPreview attachment={attachment} handleRemoveAttachment={removeAttachment} />;
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
    return (
      <div className='Form-field--display u-marginBS'>
        <div className='Arrange-sizeFill'>
          <Icon type="Icon--check" />
          {this.props.attachment.name}
        </div>
        <div className='Arrange-sizeFit'>
          <Icon
            onClick={this.handleClick}
            className='u-isActionable'
            type='Icon--clearInput' />
        </div>
      </div>
    );
  }
}

AttachmentPreview.propTypes = {
  attachment: PropTypes.object.isRequired,
  handleRemoveAttachment: PropTypes.func.isRequired
};

export {
  AttachmentPreview,
  getAttachmentPreviews
};
