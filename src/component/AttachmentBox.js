import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class AttachmentBox extends Component {
  render() {
    return (
      <div className='u-posRelative u-zIndex1'>
        <Dropzone
          onDrop={this.props.onDrop}
          className='Container--overlay Container--dashed u-posAbsolute u-marginAS'
          onDragLeave={this.props.onDragLeave}
          disableClick={true}>
          <div className='u-textCenter u-posRelative u-posCenter--vert u-textSize15'>
            <Icon type='Icon--paperclip' className='Icon--paperclip-large' />
            <p className='Form-fieldLabel'>
              { i18n.t('embeddable_framework.submitTicket.attachments.box.label',
                { fallback: 'Drop to attach' }
              )}
            </p>
          </div>
        </Dropzone>
      </div>
    );
  }
}

AttachmentBox.propTypes = {
  onDrop: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func
};

AttachmentBox.defaultProps = {
  onDragLeave: () => {}
};

