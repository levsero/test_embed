import React, { Component, PropTypes } from 'react';
import { classNames } from 'classnames';

import { Icon } from 'component/Icon';

class ZendeskLogo extends Component {
  static propTypes = {
    rtl: PropTypes.bool,
    fullscreen: PropTypes.bool,
    formSuccess: PropTypes.bool,
    className: PropTypes.string,
    utm: PropTypes.string
  };

  static defaultProps = {
    rtl: false,
    fullscreen: false,
    formSuccess: false,
    className: '',
    utm: 'webwidget'
  };

  render() {
    const { fullscreen, rtl, formSuccess } = this.props;
    const logoClasses = classNames({
      'u-linkClean': true,
      'u-posAbsolute u-posEnd--vert': !fullscreen || formSuccess,
      'u-posRelative': fullscreen,
      'u-posStart': !rtl,
      'u-posEnd': rtl,
      [this.props.className]: true
    });
    const logoUrl = [
      '//www.zendesk.com/embeddables/',
      `?utm_source=${this.props.utm}&utm_medium=poweredbyzendesk&utm_campaign=image`
    ].join('');

    return (
      <a href={logoUrl} target='_blank' className={logoClasses}>
        <Icon type='Icon--zendesk' className='u-posRelative' />
        <span className='u-isHiddenVisually'>zendesk</span>
      </a>
    );
  }
}

export { ZendeskLogo };
