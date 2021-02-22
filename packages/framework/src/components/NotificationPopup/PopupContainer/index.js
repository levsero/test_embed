import { Component } from 'react'
import PropTypes from 'prop-types'

import { TEST_IDS } from 'src/constants/shared'
import {
  MobileOverlay,
  PopupContainer,
  CtaContainer,
  CtaButtonLeft,
  CtaButtonRight,
  CloseIcon,
  WrapperButton,
  MobileSlideAppear,
  StyledSlideAppear,
  Container,
} from './styles'

export default class ChatPopup extends Component {
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
    showOnlyLeftCta: PropTypes.bool,
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
    showOnlyLeftCta: false,
  }

  constructor() {
    super()

    this.firstButton = null
  }

  onContainerClick = (e) => {
    e.stopPropagation()
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
      rightCtaDisabled,
    } = this.props

    if (!showCta) return null

    const leftCtaButton = (
      <CtaButtonLeft
        ref={(el) => (this.firstButton = el)}
        onClick={leftCtaFn}
        data-testid={TEST_IDS.BUTTON_CANCEL}
      >
        {leftCtaLabel}
      </CtaButtonLeft>
    )
    const rightCtaButton = !this.props.showOnlyLeftCta ? (
      <CtaButtonRight
        isPrimary={true}
        disabled={rightCtaDisabled}
        onClick={rightCtaFn}
        data-testid={TEST_IDS.BUTTON_OK}
      >
        {rightCtaLabel}
      </CtaButtonRight>
    ) : null

    return (
      <CtaContainer>
        {leftCtaButton}
        {rightCtaButton}
      </CtaContainer>
    )
  }

  renderCloseIcon = () => {
    if (!this.props.isDismissible) {
      return null
    }

    return <CloseIcon onClick={this.props.onCloseIconClick} />
  }

  renderChildren = () => {
    const { childrenOnClick, children } = this.props

    if (childrenOnClick) {
      return <WrapperButton onClick={childrenOnClick}>{children}</WrapperButton>
    } else {
      return children
    }
  }

  renderDefault = () => {
    const { className, containerClasses } = this.props
    const body = this.renderChildren()

    return (
      <StyledSlideAppear
        className={className}
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
        <Container className={containerClasses}>
          {body}
          {this.renderCta()}
          {this.renderCloseIcon()}
        </Container>
      </StyledSlideAppear>
    )
  }

  renderMobileOverlay = () => {
    const { className, containerClasses, show } = this.props
    const body = this.renderChildren()

    return (
      <PopupContainer hide={!show}>
        <MobileOverlay />
        <MobileSlideAppear
          direction="down"
          duration={200}
          startPosHeight="-10px"
          endPosHeight="0px"
          className={className}
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
        </MobileSlideAppear>
      </PopupContainer>
    )
  }

  render() {
    return this.props.isMobile && this.props.useOverlay
      ? this.renderMobileOverlay()
      : this.renderDefault()
  }
}
