import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

export class AttachmentForm extends Component {
  render() {
    const dropZoneClasses = classNames({
      'Container--dashed u-posAbsolute u-backgroundOverlay': true
    });
    const containerClasses = classNames({
      'u-posRelative u-zIndex': true
    });

    return (
      <div className={containerClasses}>
        <Dropzone
          onDrop={this.props.onDrop}
          className={dropZoneClasses}
          onDragLeave={this.props.onDragLeave}
          disableClick={true}>
          Attach A file here
        </Dropzone>
      </div>
    );
  }
}

