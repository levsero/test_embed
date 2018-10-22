import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {locals as styles} from './PanelCard.scss';

import { Card } from './pure/Card';
import { ButtonList } from './pure/ButtonList';
import { Icon } from 'component/Icon';

const PanelPropType = PropTypes.shape({
  heading: PropTypes.string.isRequired,
  paragraph: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAspectRatio: PropTypes.string,
  headingLineClamp: PropTypes.number,
  paragraphLineClamp: PropTypes.number,
  onClick: PropTypes.func
});

export class PanelCard extends Component {
  static propTypes = {
    panel: PanelPropType,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: [],
    panel: {
      headingLineClamp: 2,
      paragraphLineClamp: 2,
      // 2:1 aspect ratio
      imageAspectRatio: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAGDJU8cAAAAAXNSR0IArs4c6QAAABBJREFUCB1jePn67X8GEAEAJUYHgdKj8T4AAAAASUVORK5CYII='
    }
  };

  renderPanelImage(panel) {
    if (!panel.imageUrl) return;

    const imageStyle = {
      backgroundImage: `url(${panel.imageUrl})`
    };

    return (
      <div className={styles.imageContainer}>
        <img
          className={styles.aspectRatioStub}
          src={panel.imageAspectRatio} />
        <div className={styles.imagePlaceholder}>
          <Icon type="Icon--image-stroke" />
        </div>

        <div className={styles.image} style={imageStyle}></div>
      </div>
    );
  }

  renderPanelContent(panel) {
    const headingStyle = classNames(
      styles.panelHeading,
      styles.lineClamp,
      {
        [styles.panelHeaderMargin]: panel.paragraph
      }
    );
    const paragraphStyle = classNames(styles.panelParagraph, styles.lineClamp);

    // For line truncation
    const headingLineClampStyle = {
      WebkitLineClamp: panel.headingLineClamp
    };
    const paragraphLineClampStyle = {
      WebkitLineClamp: panel.paragraphLineClamp
    };

    return (
      <div className={styles.panelContent}>
        <div className={headingStyle} style={headingLineClampStyle}>{panel.heading}</div>
        <div className={paragraphStyle} style={paragraphLineClampStyle}>{panel.paragraph}</div>
      </div>
    )
  }

  render() {
    const panelStyles = classNames(styles.panelBasic, {
      [styles.panel]: !this.props.children.length,
      [styles.panelWithButtons]: this.props.children.length,
      [styles.noPadding]: true,
      [styles.hasLink]: this.props.panel.onClick
    });

    const panel = {...PanelCard.defaultProps.panel, ...this.props.panel};

    return (
      <Card>
        <button className={panelStyles} onClick={panel.onClick}>
          {this.renderPanelImage(panel)}
          {this.renderPanelContent(panel)}
        </button>

        <ButtonList>
          {this.props.children}
        </ButtonList>
      </Card>
    );
  }
}
