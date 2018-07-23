import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { isMobileBrowser } from 'utility/devices';
import { locals as styles } from './ScrollContainer.scss';

const isMobile = isMobileBrowser();

export class ScrollContainer extends Component {
  static propTypes = {
    footerContent: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element
    ]),
    children: PropTypes.node.isRequired,
    containerClasses: PropTypes.string,
    footerClasses: PropTypes.string,
    fullscreen: PropTypes.bool,
    headerContent: PropTypes.element,
    scrollShadowVisible: PropTypes.bool,
    title: PropTypes.string.isRequired,
    classes: PropTypes.string,
    onContentScrolled: PropTypes.func,
    newHeight: PropTypes.bool,
    titleClasses: PropTypes.string
  };

  static defaultProps = {
    children: <span />,
    containerClasses: '',
    footerClasses: '',
    footerContent: [],
    fullscreen: isMobile,
    headerContent: null,
    scrollShadowVisible: false,
    onContentScrolled: () => {},
    newHeight: false,
    titleClasses: ''
  };

  constructor(props, context) {
    super(props, context);

    this.state = { scrollShadowVisible: false };
    this.scrollTop = 0;

    this.content = null;
    this.header = null;
    this.footer = null;
  }

  // FIXME
  // Retains the old value of the scrollTop
  componentWillUpdate = () => {
    const container = this.content;

    this.scrollTop = container.scrollTop;
  }

  // FIXME
  // Reinstate the old scrollTop value, this is because everytime the component
  // re-renders it fails to capture and retain its child DOM node attribute.
  // Perhaps this is due to it being re-rendered three times per state change.
  componentDidUpdate = () => {
    const container = this.content;

    container.scrollTop = this.scrollTop;
  }

  scrollToBottom = () => {
    const container = this.content;

    container.scrollTop = container.scrollHeight;
  }

  scrollTo = (pos) => {
    this.content.scrollTop = pos;
  }

  getScrollHeight = () => {
    return this.content.scrollHeight;
  }

  getScrollTop = () => {
    return this.content.scrollTop;
  }

  getScrollBottom = () => {
    const { scrollHeight, scrollTop, offsetHeight } = this.content;

    return scrollHeight - (scrollTop + offsetHeight);
  }

  isAtTop = () => {
    return this.content.scrollTop === 0;
  }

  isAtBottom = () => {
    return (this.content.scrollTop + this.content.clientHeight) >= this.content.scrollHeight;
  }

  setScrollShadowVisible = (visible) => {
    this.setState({ scrollShadowVisible: visible });
  }

  renderFooter() {
    const { footerContent, footerClasses, scrollShadowVisible } = this.props;
    const footerShadowClasses = this.state.scrollShadowVisible || scrollShadowVisible ? styles.footerShadow : '';

    return (
      <footer
        ref={(el) => {this.footer = el;}}
        className={`${styles.footer} ${footerClasses} ${footerShadowClasses}`}>
        {footerContent}
      </footer>
    );
  }

  render = () => {
    const {
      fullscreen,
      headerContent,
      containerClasses,
      classes,
      onContentScrolled,
      newHeight
    } = this.props;
    const headerClasses = classNames(styles.header, styles.userHeader);
    const titleClasses = classNames(styles.title, this.props.titleClasses, { [styles.titleMobile]: fullscreen });
    const scrollContainerClasses = classNames(
      classes,
      styles.container,
      { [styles.newHeightFlexContainer]: newHeight },
      { [styles.newHeightDesktop]: newHeight && !fullscreen },
      { [styles.newHeightMobile]: newHeight && fullscreen },
      { [styles.containerDesktop]: !fullscreen }
    );
    const contentClasses = classNames(
      styles.content,
      { [styles.newHeightContent]: newHeight },
      { [styles.noNewHeightContent]: !newHeight },
      containerClasses,
      {
        [styles.contentMobile]: fullscreen,
        [styles.contentBigheader]: headerContent && fullscreen
      }
    );

    return (
      <div className={scrollContainerClasses}>
        <header ref={(el) => {this.header = el;}}
          className={headerClasses}>
          <div className={titleClasses}>
            {this.props.title}
          </div>
          {this.props.headerContent}
        </header>
        <div
          ref={(el) => {this.content = el;}}
          className={contentClasses}
          onScroll={onContentScrolled}>
          {this.props.children}
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}
