import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropzone } from 'component/Dropzone';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { locals as styles } from './ButtonDropzone.scss';

export class ButtonDropzone extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    onDrop: PropTypes.func
  };

  static defaultProps = {
    isMobile: false,
    onDrop: () => {}
  };

  render = () => {
    const label = this.props.isMobile
      ? i18n.t('embeddable_framework.submitTicket.attachments.button.label_mobile')
      : i18n.t('embeddable_framework.submitTicket.attachments.button.new_label', { files: 5 });

    return (
      <Dropzone
        onDrop={this.props.onDrop}
        activeClassName={styles.dropzoneActive}
        className={styles.dropzone}>
        <div className={styles.dropzoneChild}>
          <Icon type='Icon--paperclip-small' className={styles.icon} />
          <div className={styles.dropzoneChildLabel}>{label}</div>
        </div>
      </Dropzone>
    );
  }
}
