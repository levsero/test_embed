import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { locals as styles } from './PanelCard.scss';

import { Card } from './pure/Card';
import { ButtonList } from './pure/ButtonList';
import { Icon } from 'component/Icon';
import { isFirefox, isIE } from 'utility/devices';
import { FONT_SIZE } from 'constants/shared';

const PanelPropType = PropTypes.shape({
  heading: PropTypes.string.isRequired,
  paragraph: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAspectRatio: PropTypes.number,
  headingLineClamp: PropTypes.number,
  paragraphLineClamp: PropTypes.number,
  onClick: PropTypes.func
});

/**
 * A HOC to return the body of the Panel
 */
const PanelBody = ({ className, onClick, children }) => {
  if (onClick) {
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
};

// We calculate a max height for browsers that don't support line-clamp
const _calculateMaxHeight = function(noOfLines) {
  return (isFirefox() || isIE()) ? `${16 * noOfLines / FONT_SIZE}rem` : 'auto';
};

export class PanelCard extends Component {
  static propTypes = {
    panel: PanelPropType,
    children: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    children: [],
    panel: {
      headingLineClamp: 2,
      paragraphLineClamp: 2,
      imageAspectRatio: 2
    }
  };

  renderPanelImage(panel) {
    if (!panel.imageUrl) return;

    const imageStyle = {
      backgroundImage: `url(${panel.imageUrl})`
    };

    const aspectRatioStyle = {
      paddingBottom: `${1/panel.imageAspectRatio*100}%`
    };

    return (
      <div className={styles.imageContainer}>
        <div className={styles.aspectRatioStub} style={aspectRatioStyle}/>
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
      styles.lineClamp
    );
    const paragraphStyle = classNames(styles.panelParagraph, styles.lineClamp);

    // For line truncation
    const headingLineClampStyle = {
      WebkitLineClamp: panel.headingLineClamp,
      maxHeight: _calculateMaxHeight(panel.headingLineClamp)
    };
    const paragraphLineClampStyle = {
      WebkitLineClamp: panel.paragraphLineClamp,
      maxHeight: _calculateMaxHeight(panel.paragraphLineClamp)
    };

    return (
      <div className={styles.panelContent}>
        <div className={headingStyle} style={headingLineClampStyle}>{panel.heading}</div>
        {
          (panel.paragraph) ? (
            <div className={paragraphStyle} style={paragraphLineClampStyle}>{panel.paragraph}</div>
          ): null
        }
      </div>
    );
  }

  render() {
    const panelStyles = classNames(styles.panelBasic, {
      [styles.panel]: !this.props.children.length,
      [styles.panelWithButtons]: this.props.children.length,
      [styles.hasLink]: this.props.panel.onClick
    });

    const panel = { ...PanelCard.defaultProps.panel, ...this.props.panel };

    return (
      <Card className={this.props.className}>
        <PanelBody className={panelStyles} onClick={panel.onClick}>
          {this.renderPanelImage(panel)}
          {this.renderPanelContent(panel)}
        </PanelBody>

        <ButtonList>
          {this.props.children}
        </ButtonList>
      </Card>
    );
  }
}
