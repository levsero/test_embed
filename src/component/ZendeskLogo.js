import React from 'react/addons';

var classSet = React.addons.classSet;

export var ZendeskLogo = React.createClass({
  displayName: 'ZendeskLogo',
  render() {
    /* jshint quotmark:false */
    var applyPositionClasses = !this.props.fullscreen || this.props.formSuccess,
        logoClasses = classSet({
          'Icon Icon--zendesk u-linkClean': true,
          'u-posAbsolute u-posEnd--vert': applyPositionClasses,
          'u-posStart': !this.props.rtl && applyPositionClasses
        }),
        logoUrl = ['//www.zendesk.com/embeddables/',
          '?utm_source=webwidget&utm_medium=poweredbyzendesk&utm_campaign=image'
        ].join('');

    return (
      <div className='u-nbfc'>
        <a href={logoUrl} target='_blank' className={logoClasses}>
          <span className='u-isHiddenVisually'>zendesk</span>
        </a>
      </div>
    );
  }
});
