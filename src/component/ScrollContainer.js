import React from 'react/addons';

var classSet = React.addons.classSet;

export var ScrollContainer = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    footerContent: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.array(React.PropTypes.element)
    ]),
    fullscreen: React.PropTypes.bool
  },

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
    } else if (scrollOffset === 0 && this.state.scrollableContent) {
      this.setState({scrollableContent: false});
    }
  },

  render() {
    var containerClasses = classSet({
          'ScrollContainer-content': true,
          'u-paddingLL u-paddingTM u-marginRS u-paddingRS': true,
          'u-paddingBM': this.state.scrollableContent,
          'is-mobile': this.props.fullscreen,
          'is-bigheader': this.props.headerContent
        }),
        scrollFooterClasses = classSet({
          'ScrollContainer-footer': true,
          'u-paddingVM u-paddingHL u-posRelative': true,
          'ScrollContainer-footer--shadow': this.state.scrollableContent
        }),
        titleClasses = classSet({
          'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight': true,
          'u-textSizeBaseMobile': this.props.fullscreen
        });

    return (
      <div className='ScrollContainer u-nbfc'>
        <header className='ScrollContainer-header u-paddingBM u-paddingHL'>
          <h2 className={titleClasses}>
            {this.props.title}
          </h2>
          {this.props.headerContent}
        </header>
        <div className={containerClasses}>
          {this.props.children}
        </div>
        <footer className={scrollFooterClasses}>
          {this.props.footerContent}
        </footer>
      </div>
    );
  }
});
