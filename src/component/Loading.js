/** @jsx React.DOM */

module React from 'react/addons';

export var Loading = React.createClass({
  render() {
    /* jshint quotmark:false */
    return this.transferPropsTo(
      <div className='Loading u-textCenter'>
        <div className='Loading-item Loading-item1 u-inlineBlock'></div>
        <div className='Loading-item Loading-item2 u-inlineBlock'></div>
        <div className='Loading-item Loading-item3 u-inlineBlock'></div>
      </div>
    );
  }
});
