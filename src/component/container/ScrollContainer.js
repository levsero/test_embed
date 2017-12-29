import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { win } from 'utility/globals';

import { locals as styles } from './ScrollContainer.scss';

const frameMargin = 15;
const frameBorder = 2;

export class ScrollContainer extends Component {
  static propTypes = {
    footerContent: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element
    ]),
    children: PropTypes.node.isRequired,
    containerClasses: PropTypes.string,
    newDesign: PropTypes.bool,
    getFrameDimensions: PropTypes.func.isRequired,
    footerClasses: PropTypes.string,
    fullscreen: PropTypes.bool,
    headerContent: PropTypes.element,
    scrollShadowVisible: PropTypes.bool,
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    children: <span />,
    containerClasses: '',
    newDesign: false,
    getFrameDimensions: () => ({ height: 0, width: 0 }),
    footerClasses: '',
    footerContent: [],
    fullscreen: false,
    headerContent: null,
    scrollShadowVisible: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = { scrollShadowVisible: false };
    this.scrollTop = 0;

    this.height = 0;
    this.content = null;
    this.header = null;
    this.footer = null;
  }

  componentDidMount = () => {
    this.setHeight();
  }

  // FIXME
  // Retains the old value of the scrollTop
  componentWillUpdate = () => {
    const container = this.content;

    this.setHeight();

    this.scrollTop = container.scrollTop;
  }

  // FIXME
  // Reinstate the old scrollTop value, this is because everytime the component
  // re-renders it fails to capture and retain its child DOM node attribute.
  // Perhaps this is due to it being re-rendered three times per state change.
  componentDidUpdate = () => {
    const container = this.content;

    this.setHeight();

    container.scrollTop = this.scrollTop;
  }

  setHeight = () => {
    if (!this.props.newDesign) return;

    const container = this.content;
    const offsetHeight = this.header.clientHeight + this.footer.clientHeight + frameMargin + frameBorder;
    const windowHeight = win.innerHeight;
    const maxWindowHeight = windowHeight*0.9;
    const maxContentHeight = maxWindowHeight - offsetHeight;

    const contentHeight = this.props.getFrameDimensions().height - offsetHeight;

    // Min height is needed so that it doesn't sit above the page
    container.style.minHeight = `${contentHeight}px`;
    // Max height is needed to make sure it doesn't go beyond the bottom of the page
    container.style.maxHeight = `${maxContentHeight}px`;
  }

  scrollToBottom = () => {
    const container = this.content;

    container.scrollTop = container.scrollHeight;
  }

  setScrollShadowVisible = (visible) => {
    this.setState({ scrollShadowVisible: visible });
  }

  render = () => {
    const {
      fullscreen,
      headerContent,
      containerClasses,
      footerClasses,
      scrollShadowVisible,
      newDesign
    } = this.props;
    const mobileContentClasses = fullscreen ? styles.contentMobile : '';
    const footerShadowClasses = this.state.scrollShadowVisible || scrollShadowVisible ? styles.footerShadow : '';
    const mobileTitleClasses = fullscreen ? styles.titleMobile : '';
    const bigHeaderClasses = headerContent && fullscreen ? styles.contentBigheader : '';
    const userHeaderClasses = newDesign ? styles.userHeader : '';

    return (
      <div className={styles.container}>
        <header ref={(el) => {this.header = el;}}
          className={`${styles.header} ${userHeaderClasses}`}>
          <div className={`${styles.title} ${mobileTitleClasses}`}>
            {this.props.title}
          </div>
          {this.props.headerContent}
        </header>
        <div
          ref={(el) => {this.content = el;}}
          className={`
            ${styles.content}
            ${containerClasses}
            ${mobileContentClasses}
            ${bigHeaderClasses}`
          }>
          {this.props.children}
        </div>
        <footer
          ref={(el) => {this.footer = el;}}
          className={`${styles.footer} ${footerClasses} ${footerShadowClasses}`}>
          {this.props.footerContent}
        </footer>
      </div>
    );
  }
}
