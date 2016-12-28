import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

export class ScrollContainer extends Component {
  static propTypes = {
    footerContent: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element
    ]),
    children: PropTypes.node.isRequired,
    containerClasses: PropTypes.string,
    contentExpanded: PropTypes.bool,
    footerClasses: PropTypes.string,
    footerContentHidden: PropTypes.bool,
    fullscreen: PropTypes.bool,
    headerContent: PropTypes.element,
    hideZendeskLogo: PropTypes.bool,
    isVirtualKeyboardOpen: PropTypes.bool,
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    containerClasses: '',
    contentExpanded: false,
    footerClasses: '',
    footerContent: [],
    footerContentHidden: false,
    fullscreen: false,
    headerContent: null,
    hideZendeskLogo: false,
    isVirtualKeyboardOpen: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = { scrollShadowVisible: false };
  }

  getContentContainer = () => {
    const elem = ReactDOM.findDOMNode(this);

    return elem.querySelector('.ScrollContainer-content');
  }

  scrollToBottom = () => {
    const container = this.getContentContainer();

    container.scrollTop = container.scrollHeight;
  }

  setScrollShadowVisible = (visible) => {
    this.setState({ scrollShadowVisible: visible });
  }

  render = () => {
    const containerClasses = classNames({
      'ScrollContainer-content': true,
      'u-paddingHS u-marginHS': true,
      'u-paddingTM': !this.props.hideZendeskLogo,
      'u-paddingTL': this.props.hideZendeskLogo,
      'u-paddingBM': this.state.scrollShadowVisible,
      'is-mobile': this.props.fullscreen,
      'is-bigheader': this.props.headerContent && !this.props.isVirtualKeyboardOpen,
      'ScrollContainer--expanded': this.props.contentExpanded,
      [this.props.containerClasses]: true
    });
    const scrollFooterClasses = classNames({
      'ScrollContainer-footer': true,
      'u-paddingHL u-posRelative': true,
      'u-paddingVM': !this.props.hideZendeskLogo,
      'u-paddingVL': this.props.footerContentHidden && !this.props.hideZendeskLogo,
      'u-marginVS': this.props.footerContentHidden,
      'ScrollContainer-footer--shadow': this.state.scrollShadowVisible,
      [this.props.footerClasses]: true
    });
    const titleClasses = classNames({
      'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight': true,
      'u-textSizeBaseMobile': this.props.fullscreen
    });

    return (
      <div className='ScrollContainer u-nbfc'>
        <header className='ScrollContainer-header u-paddingVM u-paddingHL'>
          <div className={titleClasses}>
            {this.props.title}
          </div>
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
