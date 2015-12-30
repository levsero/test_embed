import React, { Component, PropTypes } from 'react';

import { Icon } from 'component/Icon';

const classNames = require('classnames');

class ZendeskLogo extends React.Component {
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

ZendeskLogo.defaultProps = {
  rtl: false,
  fullscreen: false,
  formSuccess: false,
  className: '',
  utm: 'webwidget'
};

ZendeskLogo.propTypes = {
  rtl: React.PropTypes.bool,
  fullscreen: React.PropTypes.bool,
  formSuccess: React.PropTypes.bool,
  className: React.PropTypes.string,
  utm: React.PropTypes.string
};

export { ZendeskLogo };