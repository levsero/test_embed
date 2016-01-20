import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

export class AttachmentForm extends Component {
  onDrop(files) {
    console.log('Received files: ', files);
  }

  render() {
    const dropZoneClasses = classNames({
      'Container--dashed u-posAbsolute u-backgroundOverlay': true
    });

    return (
      <div className="u-posRelative u-zIndex">

        <Dropzone onDrop={this.onDrop} className={dropZoneClasses}>
          Attach A file here
          <i className="Icon--link-large" />
        </Dropzone>
      </div>
    );
  }
}

