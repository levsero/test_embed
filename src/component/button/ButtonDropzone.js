import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { LoadingSpinner } from 'component/Loading';

export class ButtonDropzone extends Component {
  render() {
    const label = this.props.isMobile
                ? i18n.t('embeddable_framework.submitTicket.attachments.button.label_mobile',
                  { fallback: 'Add file from device' })
                : i18n.t('embeddable_framework.submitTicket.attachments.button.label',
                  { fallback: 'Add file or drop here' });

    return (
      <Dropzone
        onDrop={this.props.onDrop}
        activeClassName='Anim-color u-userTextColor u-textBold u-userFillColor'
        className='Form-field--display Container--dashed'>
        <div className='u-textCenter'>
          <Icon type='Icon--paperclip-small' className='u-inlineBlock' />
          <div className='u-inlineBlock u-alignTop'>{label}</div>
        </div>
      </Dropzone>
    );
  }
}

ButtonDropzone.propTypes = {
  onDrop: PropTypes.func,
  isMobile: PropTypes.bool
};

ButtonDropzone.defaultProps = {
  onDrop: () => {},
  isMobile: false
};
