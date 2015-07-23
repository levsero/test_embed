import React from 'react/addons';

const classSet = React.addons.classSet;

export var Loading = React.createClass({
  render() {
    /* jshint quotmark:false */
    const loadingItemClasses = classSet({
      'Loading-item': true,
      'u-userBackgroundColor': true,
      'u-inlineBlock': true
    });
    const loadingClasses = `Loading u-textCenter ${this.props.className}`;

    return (
      <div className={loadingClasses}>
        <div className={loadingItemClasses}></div>
        <div className={loadingItemClasses}></div>
        <div className={loadingItemClasses}></div>
      </div>
    );
  }
});
