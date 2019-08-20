import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Icon } from 'component/Icon'
import { Button } from '@zendeskgarden/react-buttons'
import { SlideAppear } from 'component/transition/SlideAppear'

import { locals as styles } from './ChatPopup.scss'
import classNames from 'classnames'

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
    transitionOnMount: PropTypes.bool,
    onExited: PropTypes.func,
    isDismissible: PropTypes.bool,
    onCloseIconClick: PropTypes.func,
    isMobile: PropTypes.bool,
    useOverlay: PropTypes.bool,
    showOnlyLeftCta: PropTypes.bool
  }

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
    childrenOnClick: null,
    children: null,
    show: false,
    onExited: () => {},
    isDismissible: false,
    onCloseIconClick: () => {},
    showOnlyLeftCta: false
  }

  constructor() {
    super()

    this.firstButton = null
  }

  onContainerClick = e => {
    e.stopPropagation()
  }

  ctaButtonStyle = orientation => {
    return classNames({
      [styles[orientation + 'CtaBtn']]: true,
      [styles.ctaBtnMobile]: this.props.isMobile
    })
  }

  onEntered = () => {
    if (this.firstButton) {
      this.firstButton.focus()
    }
  }

  renderCta = () => {
    const {
      showCta,
      leftCtaFn,
      rightCtaFn,
      leftCtaLabel,
      rightCtaLabel,
      rightCtaDisabled
    } = this.props

    if (!showCta) return null

    const leftCtaButtonClasses = classNames({
      [this.ctaButtonStyle('left')]: !this.props.showOnlyLeftCta,
      [styles.fullWidthButton]: this.props.showOnlyLeftCta
    })
    const ctaContainerClasses = classNames({
      [styles.ctaContainer]: !this.props.showOnlyLeftCta,
      [styles.ctaContainerNoCenter]: this.props.showOnlyLeftCta
    })
    const leftCtaButton = (
      <Button
        innerRef={el => (this.firstButton = el)}
        onTouchStartDisabled={true}
        className={leftCtaButtonClasses}
        onClick={leftCtaFn}
      >
        {leftCtaLabel}
      </Button>
    )
    const rightCtaButton = !this.props.showOnlyLeftCta ? (
      <Button
        primary={true}
        onTouchStartDisabled={true}
        className={this.ctaButtonStyle('right')}
        disabled={rightCtaDisabled}
        onClick={rightCtaFn}
      >
        {rightCtaLabel}
      </Button>
    ) : null

    return (
      <div className={ctaContainerClasses}>
        {leftCtaButton}
        {rightCtaButton}
      </div>
    )
  }

  renderCloseIcon = () => {
    if (!this.props.isDismissible) {
      return null
    }

    return (
      <Icon
        className={styles.closeIcon}
        onClick={this.props.onCloseIconClick}
        isMobile={this.props.isMobile}
        type="Icon--remove"
      />
    )
  }

  renderChildren = () => {
    const { childrenOnClick, children } = this.props

    if (childrenOnClick) {
      return (
        <button onClick={childrenOnClick} className={styles.button}>
          {children}
        </button>
      )
    } else {
      return children
    }
  }

  renderDefault = () => {
    const { className, containerClasses, isMobile } = this.props
    const containerStyles = classNames(containerClasses, {
      [styles.containerMobile]: isMobile
    })
    const body = this.renderChildren()

    return (
      <SlideAppear
        className={`${className} ${styles.containerWrapper}`}
        trigger={this.props.show}
        onClick={this.onContainerClick}
        onExited={this.props.onExited}
        onEntered={this.onEntered}
        direction="up"
        duration={200}
        startPosHeight="-10px"
        endPosHeight="-5px"
        transitionOnMount={this.props.transitionOnMount}
      >
        <div className={containerStyles}>
          {body}
          {this.renderCta()}
          {this.renderCloseIcon()}
        </div>
      </SlideAppear>
    )
  }

  renderMobileOverlay = () => {
    const { className, containerClasses, show } = this.props
    const popupContainerClasses = classNames(styles.popupContainerMobile, {
      [styles.hidden]: !show
    })
    const body = this.renderChildren()

    return (
      <div className={popupContainerClasses}>
        <div className={styles.overlayMobile} />
        <SlideAppear
          direction="down"
          duration={200}
          startPosHeight="-10px"
          endPosHeight="0px"
          className={`${className} ${styles.wrapperMobile}`}
          trigger={show}
          onEntered={this.onEntered}
          onClick={this.onContainerClick}
          onExited={this.props.onExited}
        >
          <div className={containerClasses}>
            {body}
            {this.renderCta()}
            {this.renderCloseIcon()}
          </div>
        </SlideAppear>
      </div>
    )
  }

  render() {
    return this.props.isMobile && this.props.useOverlay
      ? this.renderMobileOverlay()
      : this.renderDefault()
  }
}
