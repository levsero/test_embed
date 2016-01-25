import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

import { Icon } from 'component/Icon';

export class AttachmentForm extends Component {
  render() {
    return (
      <div className='u-posRelative u-posOverlay'>
        <Dropzone
          onDrop={this.props.onDrop}
          className='Container--overlay Container--dashed u-posAbsolute u-marginAS'
          onDragLeave={this.props.onDragLeave}
          disableClick={true}>
          <div className='u-textCenter u-posRelative u-posCenter--vert u-textSize15'>
            <Icon type='Icon--link'/>
            <p>Attach A file</p>
          </div>
        </Dropzone>
      </div>
    );
  }
}

AttachmentForm.propTypes = {
  onDrop: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func
};

AttachmentForm.defaultProps = {
  onDragLeave: () => {}
};

