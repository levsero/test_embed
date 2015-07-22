import React from 'react/addons';

import { Icon } from 'component/Icon';

var classSet = React.addons.classSet;

export var ZendeskLogo = React.createClass({
  render() {
    /* jshint quotmark:false */
    var { fullscreen, rtl, formSuccess } = this.props,
        logoClasses = classSet({
          'u-linkClean': true,
          'u-posAbsolute u-posEnd--vert': !fullscreen || formSuccess,
          'u-posRelative': fullscreen,
          'u-posStart': !rtl,
          'u-posEnd': rtl
        }),
        logoUrl = ['//www.zendesk.com/embeddables/',
          '?utm_source=webwidget&utm_medium=poweredbyzendesk&utm_campaign=image'
        ].join('');

    return (
      <div className='u-nbfc'>
        <a href={logoUrl} target='_blank' className={logoClasses}>
          <Icon type='Icon--zendesk' />
          <span className='u-isHiddenVisually'>zendesk</span>
        </a>
      </div>
    );
  }
});
