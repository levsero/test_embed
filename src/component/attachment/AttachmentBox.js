import React, { Component, PropTypes } from 'react';
import { Dropzone } from 'component/Dropzone';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

const dropzoneMargin = 38; // the frames border and padding

export class AttachmentBox extends Component {
  static propTypes = {
    dimensions: PropTypes.object,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func.isRequired
  };

  static defaultProps = {
    dimensions: { width: 0, height: 0 },
    onDragLeave: () => {}
  };

  render = () => {
    const style = {
      width: `${this.props.dimensions.width - dropzoneMargin}px`,
      height: `${this.props.dimensions.height - dropzoneMargin}px`
    };

    return (
      <div className='AttachmentBox u-posRelative'>
        <Dropzone
          onDrop={this.props.onDrop}
          className='Container--dashed u-posAbsolute u-marginAS'
          activeClassName='Anim-color u-textBold u-userFillColor'
          style={style}
          onDragLeave={this.props.onDragLeave}
          disableClick={true}>
          <div className='u-textCenter u-posRelative u-posCenter--vert u-textSizeMed'>
            <Icon type='Icon--paperclip-large' />
            <p className='Form-fieldLabel u-marginTS'>
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
