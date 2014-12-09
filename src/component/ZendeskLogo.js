/** @jsx React.DOM */

module React from 'react/addons'; /* jshint ignore:line */
import { isMobileBrowser }  from 'utility/devices';

var classSet = React.addons.classSet;

export var ZendeskLogo = React.createClass({
  getInitialState() {
    return {
      fullscreen: isMobileBrowser()
    };
  },

  render() {
  /* jshint quotmark:false */
    var logoClasses = classSet({
          'Icon Icon--zendesk u-linkClean': true,
          'u-posAbsolute u-posStart u-posEnd--vert': !this.state.fullscreen || this.props.showNotification
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
