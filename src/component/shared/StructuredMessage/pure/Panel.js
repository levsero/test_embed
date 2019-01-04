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
  roundedBottom: PropTypes.bool,
  borderBottomWidth: PropTypes.bool
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
      roundedBottom: false,
      borderBottomWidth: true
    }
  };

  renderHeroImage(panel) {
    if (panel.layout !== 'hero' || !panel.imageUrl) return;

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

    const contentClassNames = (panel.layout === 'thumbnail') ? classNames(styles.floatedPanelContent, {
      [styles.floatLeft]: (panel.align === 'right'),
      [styles.floatRight]: (panel.align === 'left'),
    }) : '';

    return (
      <div className={styles.panelContent}>
        {this.renderThumbnail(panel)}

        <div className={contentClassNames}>
          <div className={headingStyle} style={headingLineClampStyle}>{panel.heading}</div>
          {
            (panel.paragraph) ? (
              <div className={paragraphStyle} style={paragraphLineClampStyle}>{panel.paragraph}</div>
            ) : null
          }
        </div>
      </div>
    );
  }

  renderThumbnail(panel) {
    if (panel.layout !== 'thumbnail') return;

    const imageStyles = {
      backgroundImage: `url(${panel.imageUrl})`
    };

    const imageClassNames = classNames(styles.panelContentImage, {
      [styles.floatLeft]: (panel.align === 'left'),
      [styles.floatRight]: (panel.align === 'right')
    });

    return (
      <div style={imageStyles} className={imageClassNames} />
    );
  }

  render() {
    const panel = { ...Panel.defaultProps.panel, ...this.props.panel };

    const panelClassNames = classNames(styles.panel, {
      [styles.hasLink]: panel.onClick,
      [styles.noBorderRadiusTop]: !panel.roundedTop,
      [styles.noBorderRadiusBottom]: !panel.roundedBottom,
      [styles.noBorderBottomWidth]: !panel.borderBottomWidth
    });

    return (
      <PanelWrapper className={panelClassNames} onClick={panel.onClick}>
        {this.renderHeroImage(panel)}
        {this.renderPanelContent(panel)}
      </PanelWrapper>
    );
  }
}
