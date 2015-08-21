import React from 'react/addons';

const classSet = React.addons.classSet;

export var ScrollContainer = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    footerContent: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.array(React.PropTypes.element)
    ]),
    contentExpanded: React.PropTypes.bool,
    fullscreen: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      contentExpanded: false
    };
  },

  getInitialState() {
    return {
      scrollShadowVisible: false
    };
  },

  getContentContainer() {
    const elem = React.findDOMNode(this);

    return elem.querySelector('.ScrollContainer-content');
  },

  scrollToBottom() {
    const container = this.getContentContainer();

    container.scrollTop = container.scrollHeight;
  },

  setScrollShadowVisible(visible) {
    this.setState({scrollShadowVisible: visible});
  },

  render() {
    const containerClasses = classSet({
      'ScrollContainer-content': true,
      'u-paddingLL u-marginRS u-paddingRS': true,
      'u-paddingTM': !this.props.hideZendeskLogo,
      'u-paddingTL': this.props.hideZendeskLogo,
      'u-paddingBM': this.state.scrollShadowVisible,
      'is-mobile': this.props.fullscreen,
      'is-bigheader': this.props.headerContent,
      'is-expanded': this.props.contentExpanded
    });
    const scrollFooterClasses = classSet({
      'ScrollContainer-footer': true,
      'u-paddingHL u-posRelative': true,
      'u-paddingVM': !this.props.hideZendeskLogo,
      'ScrollContainer-footer--shadow': this.state.scrollShadowVisible
    });
    const titleClasses = classSet({
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
