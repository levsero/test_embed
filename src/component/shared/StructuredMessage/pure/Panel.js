import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { locals as styles } from './Panel.scss';
import { Icon } from 'component/Icon';
import { isFirefox, isIE } from 'utility/devices';
import { FONT_SIZE } from 'constants/shared';

/**
 * A HOC to return the outer element of the Panel
 */
export const PanelWrapper = ({ className, onClick, children }) => {
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

PanelWrapper.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node
};

export const PanelPropType = PropTypes.shape({
  heading: PropTypes.string.isRequired,
  paragraph: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAspectRatio: PropTypes.number,
  headingLineClamp: PropTypes.number,
  paragraphLineClamp: PropTypes.number,
  onClick: PropTypes.func,
  layout: PropTypes.oneOf(['hero', 'thumbnail']),
  align: PropTypes.oneOf(['left', 'right']),
  roundedTop: PropTypes.bool,
  roundedBottom: PropTypes.bool
});

// We calculate a max height for browsers that don't support line-clamp
const _calculateMaxHeight = function (noOfLines) {
  return (isFirefox() || isIE()) ? `${16 * noOfLines / FONT_SIZE}rem` : 'auto';
};

export class Panel extends Component {
  static propTypes = {
    panel: PanelPropType
  }

  static defaultProps = {
    panel: {
      headingLineClamp: 2,
      paragraphLineClamp: 2,
      imageAspectRatio: 2,
      layout: 'hero',
      roundedTop: false,
      roundedBottom: false
    }
  };

  renderHeroImage(panel) {
    if (!panel.imageUrl) return;

    const imageStyle = {
      backgroundImage: `url(${panel.imageUrl})`
    };

    const aspectRatioStyle = {
      paddingBottom: `${1 / panel.imageAspectRatio * 100}%`
    };

    return (
      <div className={styles.imageContainer}>
        <div className={styles.aspectRatioStub} style={aspectRatioStyle} />
        <div className={styles.imagePlaceholder}>
          <Icon type="Icon--image-stroke" />
        </div>

        <div className={styles.image} style={imageStyle} />
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
          ) : null
        }
      </div>
    );
  }

  render() {
    const panelClassNames = classNames(styles.panel, {
      [styles.hasLink]: this.props.panel.onClick,
      [styles.noBorderRadiusTop]: !this.props.panel.roundedTop,
      [styles.noBorderRadiusBottom]: !this.props.panel.roundedBottom
    });

    const panel = { ...Panel.defaultProps.panel, ...this.props.panel };

    return (
      <PanelWrapper className={panelClassNames} onClick={panel.onClick}>
        {
          (panel.layout === 'hero') ?
            this.renderHeroImage(panel)
            : null
        }
        {this.renderPanelContent(panel)}
      </PanelWrapper>
    );
  }
}
