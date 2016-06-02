import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

const dropzoneMargin = 53; // the frames margin, border and padding

export class AttachmentBox extends Component {
  render() {
    const style = {
      width: `${this.props.dimensions.width - dropzoneMargin}px`,
      height: `${this.props.dimensions.height - dropzoneMargin}px`
    };

    return (
      <div className='u-posRelative u-zIndex1'>
        <Dropzone
          onDrop={this.props.onDrop}
          className='Container--overlay Container--dashed u-posAbsolute u-marginAS'
          style={style}
          onDragLeave={this.props.onDragLeave}
          disableClick={true}>
          <div className='u-textCenter u-posRelative u-posCenter--vert u-textSize15'>
            <Icon type='Icon--paperclip' className='Icon--paperclip-large' />
            <p className='Form-fieldLabel'>
              {i18n.t('embeddable_framework.submitTicket.attachments.box.label',
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
  dimensions: PropTypes.object,
  onDragLeave: PropTypes.func
};

AttachmentBox.defaultProps = {
  dimensions: { width: 0, height: 0 },
  onDragLeave: () => {}
};

