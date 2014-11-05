/** @jsx React.DOM */

module React from 'react/addons';

export var Loading = React.createClass({
  render() {
    /* jshint quotmark:false */
    return this.transferPropsTo(
      <div className='Loading u-textCenter'>
        <div className='Loading-item Loading-item1 custom-backgroundColor u-inlineBlock'></div>
        <div className='Loading-item Loading-item2 custom-backgroundColor u-inlineBlock'></div>
        <div className='Loading-item Loading-item3 custom-backgroundColor u-inlineBlock'></div>
      </div>
    );
  }
});
