import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { locals as styles } from './ScrollContainer.sass';

export class ScrollContainer extends Component {
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
    const { fullscreen, contentExpanded, containerClasses, footerClasses } = this.props;
    const expandedClasses = contentExpanded ? styles.expanded : '';
    const mobileContentClasses = fullscreen ? styles.contentMobile : '';
    const footerShadowClasses = this.state.scrollShadowVisible ? styles.footerShadow : '';
    const mobileTitleClasses = fullscreen ? styles.titleMobile : '';

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={`${styles.title} ${mobileTitleClasses}`}>
            {this.props.title}
          </div>
          {this.props.headerContent}
        </header>
        <div id='content' className={`${styles.content} ${containerClasses} ${expandedClasses} ${mobileContentClasses}`}>
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

ScrollContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footerContent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  headerContent: PropTypes.element,
  containerClasses: PropTypes.string,
  footerClasses: PropTypes.string,
  contentExpanded: PropTypes.bool,
  fullscreen: PropTypes.bool
};

ScrollContainer.defaultProps = {
  footerContent: [],
  headerContent: null,
  containerClasses: '',
  footerClasses: '',
  contentExpanded: false,
  fullscreen: false
};
