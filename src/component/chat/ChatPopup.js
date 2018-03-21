import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'component/Icon';
import { Button } from 'component/button/Button';
import { SlideUpAppear } from 'component/transition/SlideUpAppear';

import { locals as styles } from './ChatPopup.scss';
import classNames from 'classnames';

export class ChatPopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    containerClassName: PropTypes.string,
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
    onCloseIconClick: PropTypes.func
  };

  static defaultProps = {
    className: '',
    containerClassName: '',
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
            className={styles.leftCtaBtn}
            primary={false}
            onClick={leftCtaFn} />
          <Button
            onTouchStartDisabled={true}
            label={rightCtaLabel}
            className={styles.rightCtaBtn}
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
        type='Icon--remove' />
    );
  }

  render = () => {
    const { className, childrenOnClick, children, containerClassName } = this.props;
    const containerClasses = classNames(
      styles.container,
      containerClassName
    );

    return (
      <SlideUpAppear
        className={`${className} ${styles.containerWrapper}`}
        trigger={this.props.show}
        onClick={this.onContainerClick}
        onExited={this.props.onExited}>
        <div className={containerClasses}>
          <div onClick={childrenOnClick}>{children}</div>
          {this.renderCta()}
          {this.renderCloseIcon()}
        </div>
      </SlideUpAppear>
    );
  }
}
