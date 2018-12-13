import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MAX_WIDGET_HEIGHT, MIN_WIDGET_HEIGHT, WIDGET_MARGIN } from 'constants/shared';
import Refocus from 'component/Refocus';

import { win } from 'utility/globals';
import { locals as styles } from './ScrollContainer.scss';

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
    isMobile: PropTypes.bool,
    headerContent: PropTypes.element,
    maxHeight: PropTypes.number,
    scrollShadowVisible: PropTypes.bool,
    title: PropTypes.string.isRequired,
    classes: PropTypes.string,
    onContentScrolled: PropTypes.func,
    titleClasses: PropTypes.string
  };

  static defaultProps = {
    children: <span />,
    containerClasses: '',
    footerClasses: '',
    footerContent: [],
    headerContent: null,
    maxHeight: MAX_WIDGET_HEIGHT,
    scrollShadowVisible: false,
    onContentScrolled: () => {},
    titleClasses: '',
    isMobile: false,
    fullscreen: false
  };

  constructor(props, context) {
    super(props, context);

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

  calculateHeight = () => {
    if (this.props.fullscreen || this.props.isMobile) return null;

    const winHeight = win.innerHeight;
    const { maxHeight } = this.props;

    // If the window is smaller then the widget's size
    if (winHeight < maxHeight) {
      // cap minimum widget height so it doesn't look too squashed
      return winHeight > MIN_WIDGET_HEIGHT
        ? winHeight - WIDGET_MARGIN*2
        : MIN_WIDGET_HEIGHT - WIDGET_MARGIN*2;
    }

    return maxHeight;
  }

  renderFooter() {
    const { footerContent, footerClasses, scrollShadowVisible } = this.props;
    const footerShadowClasses = scrollShadowVisible ? styles.footerShadow : '';

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
      isMobile,
      headerContent,
      containerClasses,
      classes,
      onContentScrolled,
      fullscreen
    } = this.props;
    const headerClasses = classNames(styles.header, styles.userHeader);
    const titleClasses = classNames(styles.title, this.props.titleClasses, { [styles.titleMobile]: isMobile });
    const scrollContainerClasses = classNames(
      classes,
      styles.container,
      styles.flexContainer,
      { [styles.desktop]: !isMobile },
      { [styles.desktopFullscreen]: !isMobile && fullscreen },
      { [styles.containerDesktop]: !isMobile && !fullscreen  },
      { [styles.mobile]: isMobile },
    );
    const contentClasses = classNames(
      styles.content,
      containerClasses,
      {
        [styles.contentMobile]: isMobile,
        [styles.contentBigheader]: headerContent && (isMobile || fullscreen)
      }
    );

    return (
      <div data-testid="scrollcontainer" style={{ height: this.calculateHeight() }} className={scrollContainerClasses}>
        <header ref={(el) => {this.header = el;}}
          className={headerClasses}>
          <h1 className={titleClasses}>
            {this.props.title}
          </h1>
          {this.props.headerContent}
        </header>
        <div
          ref={(el) => {this.content = el;}}
          className={contentClasses}
          onScroll={onContentScrolled}>
          <Refocus>{this.props.children}</Refocus>
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}
