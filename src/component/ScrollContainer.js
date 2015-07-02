import React from 'react/addons';

var classSet = React.addons.classSet;

export var ScrollContainer = React.createClass({
  getInitialState() {
    return {
      scrollableContent: false
    };
  },

  componentDidMount() {
    this.checkScrollOffset();
  },

  componentDidUpdate() {
    this.checkScrollOffset();
  },

  checkScrollOffset() {
    var elem = React.findDOMNode(this),
        container = elem.querySelector('.ScrollContainer-content'),
        scrollOffset = container.scrollHeight - container.offsetHeight;

    if (scrollOffset > 0 && !this.state.scrollableContent) {
      this.setState({scrollableContent: true});
    }

    if (scrollOffset === 0 && this.state.scrollableContent) {
      this.setState({scrollableContent: false});
    }
  },

  render() {
    var containerClasses = classSet({
          'ScrollContainer-content': true,
          'u-paddingLL u-paddingVM u-marginRS u-paddingRS': true
        }),
        scrollHeaderClasses = classSet({
          'ScrollContainer-header': true,
          'u-paddingVM u-paddingHL': true
        }),
        scrollFooterClasses = classSet({
          'ScrollContainer-footer': true,
          'u-paddingBM u-paddingHL u-posRelative': true,
          'ScrollContainer-footer--shadow u-paddingTS': this.state.scrollableContent
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
