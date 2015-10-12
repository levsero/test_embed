import React from 'react/addons';

import { Icon } from 'component/Icon';

const classSet = React.addons.classSet;

const utm = {
  embeddednps: 'embeddednps',
  webwidget: 'webwidget'
};

export var ZendeskLogo = React.createClass({
  getDefaultProps() {
    return {
      className: '',
      utm: utm.webwidget
    };
  },
  render() {
    /* jshint quotmark:false */
    const { fullscreen, rtl, formSuccess } = this.props;
    const logoClasses = classSet({
      'u-linkClean': true,
      'u-posAbsolute u-posEnd--vert': !fullscreen || formSuccess,
      'u-posRelative': fullscreen,
      'u-posStart': !rtl,
      'u-posEnd': rtl,
      [this.props.className]: true
    });
    const logoUrl = [
      '//www.zendesk.com/embeddables/',
      `?utm_source=${utm[this.props.utm]}&utm_medium=poweredbyzendesk&utm_campaign=image`
    ].join('');

    return (
      <a href={logoUrl} target='_blank' className={logoClasses}>
        <Icon type='Icon--zendesk' className='u-posRelative' />
        <span className='u-isHiddenVisually'>zendesk</span>
      </a>
    );
  }
});
