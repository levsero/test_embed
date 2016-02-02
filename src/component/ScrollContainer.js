import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

export class ScrollContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      scrollShadowVisible: false
    };
  }

  getContentContainer() {
    const elem = ReactDOM.findDOMNode(this);

    return elem.querySelector('.ScrollContainer-content');
  }

  scrollToBottom() {
    const container = this.getContentContainer();

    container.scrollTop = container.scrollHeight;
  }

  setScrollShadowVisible(visible) {
    this.setState({scrollShadowVisible: visible});
  }

  render() {
    const containerClasses = classNames({
      'ScrollContainer-content': true,
      'u-paddingLL u-marginRS u-paddingRS': true,
      'u-paddingTM': !this.props.hideZendeskLogo,
      'u-paddingTL': this.props.hideZendeskLogo,
      'u-paddingBM': this.state.scrollShadowVisible,
      'is-mobile': this.props.fullscreen,
      'is-bigheader': this.props.headerContent && !this.props.isVirtualKeyboardOpen,
      'is-expanded': this.props.contentExpanded
    });
    const scrollFooterClasses = classNames({
      'ScrollContainer-footer': true,
      'u-paddingHL u-posRelative': true,
      'u-paddingVM': !this.props.hideZendeskLogo,
      'ScrollContainer-footer--shadow': this.state.scrollShadowVisible
    });
    const titleClasses = classNames({
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
}

ScrollContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footerContent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array(PropTypes.element)
  ]),
  headerContent: PropTypes.element,
  contentExpanded: PropTypes.bool,
  fullscreen: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  isVirtualKeyboardOpen: PropTypes.bool
};

ScrollContainer.defaultProps = {
  footerContent: [],
  headerContent: null,
  contentExpanded: false,
  fullscreen: false,
  hideZendeskLogo: false,
  isVirtualKeyboardOpen: false
};
