import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

import { Icon } from 'component/Icon';

export class AttachmentForm extends Component {
  render() {
    const containerClasses = classNames({
      'u-posRelative u-posOverlay': true
    });
    const dropZoneClasses = classNames({
      'Container--overlay Container--dashed u-posAbsolute u-marginAS': true
    });

    return (
      <div className={containerClasses}>
        <Dropzone
          onDrop={this.props.onDrop}
          className={dropZoneClasses}
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

