import React from 'react/addons';

var classSet = React.addons.classSet;

export var ScrollContainer = React.createClass({
  render() {
    /* jshint quotmark:false */
    var containerClasses = classSet({
          'ScrollContainer-content': true,
          'u-paddingHL u-paddingTM': true
        }),
        scrollHeaderClasses = classSet({
          'ScrollContainer-header': true,
          'u-paddingVM u-paddingHL': true
        }),
        scrollFooterClasses = classSet({
          'ScrollContainer-footer': true,
          'u-paddingVM u-paddingHL': true
        }),
        titleClasses = classSet({
          'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight': true,
          'u-textSizeBaseMobile': this.props.fullscreen
        });

    return (
      <div className='ScrollContainer'>
        <header className={scrollHeaderClasses}>
          <h2 className={titleClasses}>
            {this.props.header}
          </h2>
          {this.props.headerContent}
        </header>
        <div className={containerClasses}>
          {this.props.children}
        </div>
        <footer className={scrollFooterClasses}>
          {this.props.footer}
        </footer>
      </div>
    );
  }
});
