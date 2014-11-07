/** @jsx React.DOM */

module React from 'react/addons';

var classSet = React.addons.classSet;

export var Loading = React.createClass({
  render() {
    /* jshint quotmark:false */
    var loadingItemClasses = classSet({
      'Loading-item': true,
      'u-userBackgroundColor': true,
      'u-inlineBlock': true
    });

    return this.transferPropsTo(
      <div className='Loading u-textCenter'>
        <div className={loadingItemClasses}></div>
        <div className={loadingItemClasses}></div>
        <div className={loadingItemClasses}></div>
      </div>
    );
  }
});
