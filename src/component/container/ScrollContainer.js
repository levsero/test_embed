import React, { Component, PropTypes } from 'react';
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
    contentExpanded: PropTypes.bool,
    footerClasses: PropTypes.string,
    fullscreen: PropTypes.bool,
    headerContent: PropTypes.element,
    scrollShadowVisible: PropTypes.bool,
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    children: <span />,
    containerClasses: '',
    contentExpanded: false,
    footerClasses: '',
    footerContent: [],
    fullscreen: false,
    headerContent: null,
    scrollShadowVisible: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = { scrollShadowVisible: false };
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
      contentExpanded,
      containerClasses,
      footerClasses,
      scrollShadowVisible
    } = this.props;
    const expandedClasses = contentExpanded ? styles.expanded : '';
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
            ${expandedClasses}
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
