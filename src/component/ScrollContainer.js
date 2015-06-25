import React from 'react/addons';

var classSet = React.addons.classSet;

export var ScrollContainer = React.createClass({
  render() {
    /* jshint quotmark:false */
    var containerClasses = classSet({
          'ScrollContainer': true,
          'u-posRelative': true
        });

    return (
      <div className={containerClasses}>
        <header>{this.props.header}</header>
        <div className='ScrollContainer-content'>
          {this.props.children}
        </div>
        <footer>{this.props.footer}</footer>
      </div>
    );
  }
});
