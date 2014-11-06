/** @jsx React.DOM */

module React from 'react/addons';

export var Loading = React.createClass({
  render() {
    /* jshint quotmark:false */
    var loadingItemClasses = [
          'Loading-item',
          'u-user-backgroundColor',
          'u-inlineBlock'
        ].join(' ');
    return this.transferPropsTo(
      <div className='Loading u-textCenter'>
        <div className={loadingItemClasses + ' Loading-item1'}></div>
        <div className={loadingItemClasses + ' Loading-item2'}></div>
        <div className={loadingItemClasses + ' Loading-item3'}></div>
      </div>
    );
  }
});
