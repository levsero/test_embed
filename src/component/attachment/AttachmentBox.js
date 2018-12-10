import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropzone } from 'component/Dropzone';

import { Icon } from 'component/Icon';
import { MAX_WIDGET_HEIGHT, WIDGET_WIDTH } from 'constants/shared';
import { i18n } from 'service/i18n';
import { locals as styles } from './AttachmentBox.scss';

const dropzoneMargin = 19; // the frames border and padding

export class AttachmentBox extends Component {
  static propTypes = {
    dimensions: PropTypes.object,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func.isRequired
  };

  static defaultProps = {
    dimensions: { width: WIDGET_WIDTH, height: MAX_WIDGET_HEIGHT },
    onDragLeave: () => {}
  };

  render = () => {
    const style = {
      width: `${this.props.dimensions.width - dropzoneMargin}px`,
      height: `${this.props.dimensions.height - dropzoneMargin}px`
    };
    const dropzoneContainerStyles = {
      width: `${this.props.dimensions.width}px`,
      height: `${this.props.dimensions.height}px`
    };

    return (
      <div className={styles.container}>
        <Dropzone
          onDrop={this.props.onDrop}
          className={styles.dropzone}
          activeClassName={styles.dropzoneActive}
          style={style}
          containerStyle={dropzoneContainerStyles}
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
