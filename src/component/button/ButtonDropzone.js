import React, { Component, PropTypes } from 'react';

import { Dropzone } from 'component/Dropzone';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

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
                ? i18n.t('embeddable_framework.submitTicket.attachments.button.label_mobile',
                  { fallback: 'Add file from device' })
                : i18n.t('embeddable_framework.submitTicket.attachments.button.label',
                  { fallback: 'Add file or drop here' });

    return (
      <Dropzone
        onDrop={this.props.onDrop}
        activeClassName='Anim-color u-userTextColor u-textBold'
        className='Button--dropzone Container--dashed u-isActionable u-marginTS'>
        <div className='u-textCenter'>
          <Icon type='Icon--paperclip-small' className='u-inlineBlock u-userFillColor' />
          <div className='u-inlineBlock u-alignTop'>{label}</div>
        </div>
      </Dropzone>
    );
  }
}
