import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';

export class ZendeskLogo extends Component {
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
    const logoType = this.props.golionLogo ? 'Icon--golion' : 'Icon--zendesk';

    const logoUrl = [
      `//www.zendesk.com/${this.props.logoLink}/`,
      `?utm_source=${this.props.utm}&utm_medium=poweredbyzendesk&utm_campaign=image`
    ].join('');

    return (
      <a href={logoUrl} target='_blank' className={logoClasses}>
        <Icon type={logoType} className='u-posRelative' />
        <span className='u-isHiddenVisually'>zendesk</span>
      </a>
    );
  }
}

ZendeskLogo.propTypes = {
  rtl: PropTypes.bool,
  fullscreen: PropTypes.bool,
  formSuccess: PropTypes.bool,
  className: PropTypes.string,
  utm: PropTypes.string,
  logoLink: PropTypes.string,
  golionLogo: PropTypes.bool
};

ZendeskLogo.defaultProps = {
  rtl: false,
  fullscreen: false,
  formSuccess: false,
  className: '',
  utm: 'webwidget',
  logoLink: 'embeddables',
  golionLogo: false
};
