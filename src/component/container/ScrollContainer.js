import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { locals as styles } from './ScrollContainer.sass';

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
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    children: <span />,
    containerClasses: '',
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
  }

  // FIXME
  // Retains the old value of the scrollTop
  componentWillUpdate = () => {
    const container = this.getContentContainer();

    if (!container) return;

    this.scrollTop = container.scrollTop;
  }

  // FIXME
  // Reinstate the old scrollTop value, this is because everytime the component
  // re-renders it fails to capture and retain its child DOM node attribute.
  // Perhaps this is due to it being re-rendered three times per state change.
  componentDidUpdate = () => {
    const container = this.getContentContainer();

    if (!container) return;

    container.scrollTop = this.scrollTop;
  }

  getContentContainer = () => {
    const elem = ReactDOM.findDOMNode(this);

    return elem.querySelector('#content');
  }

  scrollToBottom = () => {
    const container = this.getContentContainer();

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
      scrollShadowVisible
    } = this.props;
    const mobileContentClasses = fullscreen ? styles.contentMobile : '';
    const footerShadowClasses = this.state.scrollShadowVisible || scrollShadowVisible ? styles.footerShadow : '';
    const mobileTitleClasses = fullscreen ? styles.titleMobile : '';
    const bigHeaderClasses = headerContent && fullscreen ? styles.contentBigheader : '';

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={`${styles.title} ${mobileTitleClasses}`}>
            {this.props.title}
          </div>
          {this.props.headerContent}
        </header>
        <div
          id='content'
          className={`
            ${styles.content}
            ${containerClasses}
            ${mobileContentClasses}
            ${bigHeaderClasses}`
          }>
          {this.props.children}
        </div>
        <footer
          className={`${styles.footer} ${footerClasses} ${footerShadowClasses}`}>
          {this.props.footerContent}
        </footer>
      </div>
    );
  }
}
