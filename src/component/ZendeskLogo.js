import React from 'react/addons';

const classSet = React.addons.classSet;

export var ZendeskLogo = React.createClass({
  render() {
    /* jshint quotmark:false */
    const applyPositionClasses = !this.props.fullscreen || this.props.formSuccess;
    const logoClasses = classSet({
      'Icon Icon--zendesk u-linkClean': true,
      'u-posAbsolute u-posEnd--vert': applyPositionClasses,
      'u-posStart': !this.props.rtl && applyPositionClasses
    });
    const logoUrl = [
      '//www.zendesk.com/embeddables/',
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
