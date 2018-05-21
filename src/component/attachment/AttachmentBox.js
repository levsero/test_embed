import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropzone } from 'component/Dropzone';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { locals as styles } from './AttachmentBox.scss';

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
      <div className={styles.container}>
        <Dropzone
          onDrop={this.props.onDrop}
          className={styles.dropzone}
          activeClassName={styles.dropzoneActive}
          style={style}
          onDragLeave={this.props.onDragLeave}
          disableClick={true}>
          <div className={styles.dropzoneChild}>
            <Icon type='Icon--paperclip-large' />
            <p className={styles.dropzoneChildLabel}>
              {i18n.t('embeddable_framework.common.attachments.dragdrop')}
            </p>
          </div>
        </Dropzone>
      </div>
    );
  }
}
