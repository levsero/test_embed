import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'component/Icon';
import { Button } from 'component/button/Button';
import { SlideAppear } from 'component/transition/SlideAppear';

import { locals as styles } from './ChatPopup.scss';
import classNames from 'classnames';

export class ChatPopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    containerClasses: PropTypes.string,
    showCta: PropTypes.bool,
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func,
    leftCtaLabel: PropTypes.string,
    rightCtaLabel: PropTypes.string,
    rightCtaDisabled: PropTypes.bool,
    childrenOnClick: PropTypes.func,
    children: PropTypes.node,
    show: PropTypes.bool,
    onExited: PropTypes.func,
    isDismissible: PropTypes.bool,
    onCloseIconClick: PropTypes.func,
    isMobile: PropTypes.bool,
    useOverlay: PropTypes.bool
  };

  static defaultProps = {
    isMobile: false,
    useOverlay: false,
    className: '',
    containerClasses: '',
    showCta: true,
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    leftCtaLabel: '',
    rightCtaLabel: '',
    rightCtaDisabled: false,
    childrenOnClick: () => {},
    children: null,
    show: false,
    onExited: () => {},
    isDismissible: false,
    onCloseIconClick: () => {}
  };

  onContainerClick = (e) => {
    e.stopPropagation();
  }

  ctaButtonStyle = (orientation) => {
    return classNames({
      [styles[orientation + 'CtaBtn']]: true,
      [styles.ctaBtnMobile]: this.props.isMobile
    });
  }

  renderCta = () => {
    const {
      showCta, leftCtaFn, rightCtaFn,
      leftCtaLabel, rightCtaLabel, rightCtaDisabled
    } = this.props;

    return (showCta)
      ? <div className={styles.ctaContainer}>
        <Button
          onTouchStartDisabled={true}
          label={leftCtaLabel}
          className={this.ctaButtonStyle('left')}
          primary={false}
          onClick={leftCtaFn} />
        <Button
          onTouchStartDisabled={true}
          label={rightCtaLabel}
          className={this.ctaButtonStyle('right')}
          primary={true}
          disabled={rightCtaDisabled}
          onClick={rightCtaFn} />
      </div>
      : null;
  }

  renderCloseIcon = () => {
    if (!this.props.isDismissible) {
      return null;
    }

    return (
      <Icon
        className={styles.closeIcon}
        onClick={this.props.onCloseIconClick}
        isMobile={this.props.isMobile}
        type='Icon--remove' />
    );
  }

  renderDefault = () => {
    const { className, childrenOnClick, children, containerClasses } = this.props;
    const containerStyles = classNames(
      styles.container,
      containerClasses
    );

    return (
      <SlideAppear
        className={`${className} ${styles.containerWrapper}`}
        trigger={this.props.show}
        onClick={this.onContainerClick}
        onExited={this.props.onExited}>
        <div className={containerStyles}>
          <div onClick={childrenOnClick}>{children}</div>
          {this.renderCta()}
          {this.renderCloseIcon()}
        </div>
      </SlideAppear>
    );
  }

  renderMobileOverlay = () => {
    const { className, childrenOnClick, children, containerClasses, show } = this.props;
    const popupContainerClasses = classNames(
      styles.popupContainerMobile,
      { [styles.hidden]: !show }
    );

    return (
      <div className={popupContainerClasses}>
        <div className={styles.overlayMobile} />
        <SlideAppear
          direction={'down'}
          duration={200}
          startPosHeight={'-10px'}
          endPosHeight={'0px'}
          className={`${className} ${styles.wrapperMobile}`}
          trigger={show}
          onClick={this.onContainerClick}
          onExited={this.props.onExited}>
          <div className={containerClasses}>
            <div onClick={childrenOnClick}>{children}</div>
            {this.renderCta()}
            {this.renderCloseIcon()}
          </div>
        </SlideAppear>
      </div>
    );
  }

  render() {
    return (this.props.isMobile && this.props.useOverlay)
      ? this.renderMobileOverlay()
      : this.renderDefault();
  }
}
