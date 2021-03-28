import { cloneElement, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { locals as styles } from './Frame.scss'

import EmbedWrapper from 'component/frame/EmbedWrapper'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { getZoomSizingRatio } from 'utility/devices'
import Transition from 'react-transition-group/Transition'
import { widgetShowAnimationComplete } from 'src/redux/modules/base/base-actions'
import {
  getFixedStyles,
  getColor,
  getHorizontalPosition,
  getFrameVisible,
  getFrameStyle,
} from 'src/redux/modules/selectors'
import {
  FONT_SIZE,
  DEFAULT_WIDGET_HEIGHT,
  MIN_WIDGET_HEIGHT,
  WIDGET_WIDTH,
  FRAME_TRANSITION_DURATION,
  TEST_IDS,
  WIDGET_MARGIN,
} from 'constants/shared'
import { getChatStandalone, getLocale } from 'src/redux/modules/base/base-selectors'
import {
  getStylingOffset,
  getStylingPositionVertical,
  getStylingZIndex,
} from 'src/redux/modules/settings/settings-selectors'
import { onNextTick } from 'src/util/utils'
import IFrame from 'src/framework/components/Frame'

const mapStateToProps = (state, ownProps) => {
  return {
    fixedStyles: getFixedStyles(state, ownProps.name),
    color: getColor(state, ownProps.name),
    horizontalPosition: getHorizontalPosition(state),
    visible: getFrameVisible(state, ownProps.name),
    chatStandalone: getChatStandalone(state),
    frameStyle: getFrameStyle(state, ownProps.name),
    offset: getStylingOffset(state),
    verticalPosition: getStylingPositionVertical(state),
    zIndex: getStylingZIndex(state),
    locale: getLocale(state),
  }
}

const sizingRatio = FONT_SIZE * getZoomSizingRatio()
const baseFontCSS = `html { font-size: ${sizingRatio}px }`
const transitionDuration = FRAME_TRANSITION_DURATION

const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

class Frame extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
    offset: PropTypes.shape({
      horizontal: stringOrNumber,
      vertical: stringOrNumber,
      mobile: PropTypes.shape({
        horizontal: stringOrNumber,
        vertical: stringOrNumber,
      }),
    }).isRequired,
    rawCSS: PropTypes.string,
    frameStyleModifier: PropTypes.func,
    frameStyle: PropTypes.shape({
      height: PropTypes.string,
      marginBottom: stringOrNumber,
      marginLeft: stringOrNumber,
      marginRight: stringOrNumber,
      marginTop: stringOrNumber,
      minHeight: PropTypes.string,
      zIndex: PropTypes.number,
    }).isRequired,
    fullscreenable: PropTypes.bool,
    hideNavigationButtons: PropTypes.bool,
    alwaysShow: PropTypes.bool,
    name: PropTypes.string,
    onBack: PropTypes.func,
    horizontalPosition: PropTypes.oneOf(['right', 'left']),
    verticalPosition: PropTypes.oneOf(['top', 'bottom']),
    preventClose: PropTypes.bool,
    useBackButton: PropTypes.bool,
    visible: PropTypes.bool,
    title: PropTypes.string,
    fixedStyles: PropTypes.shape({
      height: stringOrNumber,
      bottom: PropTypes.oneOf([0]),
      top: PropTypes.oneOf(['initial']),
      background: PropTypes.oneOf(['transparent']),
      maxHeight: PropTypes.string,
    }),
    widgetShowAnimationComplete: PropTypes.func,
    color: PropTypes.shape({
      base: PropTypes.string,
      text: PropTypes.string,
      launcher: PropTypes.string,
      launcherText: PropTypes.string,
      button: PropTypes.string,
      resultLists: PropTypes.string,
      header: PropTypes.string,
      articleLinks: PropTypes.string,
    }).isRequired,
    generateUserCSS: PropTypes.func,
    chatStandalone: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    customFrameStyle: PropTypes.shape({
      height: PropTypes.string,
      marginBottom: stringOrNumber,
      marginLeft: stringOrNumber,
      marginRight: stringOrNumber,
      marginTop: stringOrNumber,
      minHeight: PropTypes.string,
      zIndex: PropTypes.number,
    }),
    zIndex: PropTypes.number,
  }

  static defaultProps = {
    css: '',
    frameStyleModifier: () => {},
    frameOffsetHeight: 15,
    customFrameStyle: {},
    fullscreenable: false,
    hideNavigationButtons: false,
    name: '',
    alwaysShow: false,
    onBack: () => {},
    preventClose: false,
    store: { dispatch: () => {} },
    useBackButton: false,
    visible: true,
    title: '',
    fixedStyles: {},
    widgetShowAnimationComplete: () => {},
    generateUserCSS: () => {},
    chatStandalone: false,
    isMobile: false,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      hiddenByZoom: false,
      customCSS: '',
    }

    this.child = null
    this.iframe = null

    this.iframeRoot = document.createElement('div')
  }

  componentDidMount = () => {
    this.setCustomCSS()
    this.updateIFrameRootStyles()
    this.updateFrameLocale()
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.name === 'launcher') {
      onNextTick(() => {
        const newWidth = this.computeIframeStyle().width
        const oldStyles = this.iframe.getAttribute('style')

        if (newWidth !== oldStyles.width) {
          this.iframe.setAttribute('style', oldStyles + `width: ${newWidth}px;`)
        }
      })
    }

    if (this.props.color !== prevProps.color) {
      this.setCustomCSS()
    }

    this.updateIFrameRootStyles()
    this.updateFrameLocale()
  }

  setCustomCSS() {
    this.setState({
      customCSS: this.generateUserCSSWithColor(this.props.color),
    })
  }

  updateIFrameRootStyles() {
    const { isMobile, fullscreenable, fullscreen, horizontalPosition } = this.props
    const mobileFullscreen = fullscreenable && isMobile

    const desktopClasses = mobileFullscreen ? '' : styles.desktop
    const positionClasses = horizontalPosition === 'left' ? styles.left : styles.right

    if (fullscreen) {
      this.iframeRoot.style.minWidth = '100%'
    }

    this.iframeRoot.className = `${positionClasses} ${desktopClasses}`

    if (mobileFullscreen) {
      onNextTick(this.applyMobileBodyStyle)
    }
  }

  getContentDocument = () => {
    if (!this.iframe) {
      return null
    }
    return this.iframe.contentDocument
  }

  getContentWindow = () => {
    return this.iframe.contentWindow
  }

  getRootComponentElement = () => {
    return this.child.embed
  }

  getRootComponent = () => {
    if (this.child) {
      return this.child.refs.rootComponent
    }
  }

  getChild = () => {
    return this.child
  }

  updateFrameLocale = () => {
    // Need to defer to the next tick because Firefox renders differently
    onNextTick(() => {
      const contentDocument = this.getContentDocument()
      if (!contentDocument) {
        return
      }
      const html = contentDocument.documentElement
      const direction = i18n.isRTL() ? 'rtl' : 'ltr'

      html.setAttribute('lang', i18n.getLocale())
      html.setAttribute('dir', direction)
    })
  }

  updateFrameTitle = (title) => {
    const doc = this.getContentDocument()

    this.iframe.title = doc.title = title
  }

  getDefaultDimensions = () => {
    const { fullscreenable, fullscreen, isMobile, horizontalPosition } = this.props
    const isLeft = horizontalPosition === 'left'

    let fullscreenStyle = {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
    }

    if (fullscreen && !isMobile) {
      fullscreenStyle = {
        ...fullscreenStyle,
        [horizontalPosition]: isLeft ? fullscreenStyle.position : '50%',
        background: '#EEE',
      }
    }
    const popoverStyle = {
      width: `${WIDGET_WIDTH + 2 * WIDGET_MARGIN}px`,
      height: '100%',
      maxHeight: `${DEFAULT_WIDGET_HEIGHT + 2 * WIDGET_MARGIN}px`,
      minHeight: `${MIN_WIDGET_HEIGHT}px`,
    }

    if ((fullscreen || isMobile) && fullscreenable) {
      return fullscreenStyle
    } else {
      return popoverStyle
    }
  }

  updateBaseFontSize = (fontSize) => {
    const htmlElem = this.getContentDocument().documentElement

    htmlElem.style.fontSize = fontSize
  }

  back = (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    this.props.onBack(this)
  }

  setHiddenByZoom = (hiddenByZoom) => {
    this.setState({ hiddenByZoom })
  }

  applyMobileBodyStyle = () => {
    const frameDoc = this.getContentDocument()
    const fullscreenStyles = ['width: 100%', 'height: 100%', 'overflow-x: hidden'].join(';')

    if (frameDoc && frameDoc.body && frameDoc.body.firstChild) {
      frameDoc.body.firstChild.setAttribute('style', fullscreenStyles)
    }
  }

  computeIframeStyle = () => {
    const frameStyle = _.defaults({}, this.props.customFrameStyle, this.props.frameStyle)
    const modifiedStyles = this.child
      ? this.props.frameStyleModifier(frameStyle, this.getRootComponentElement()) || frameStyle
      : frameStyle
    const mobileFullscreen = this.props.isMobile && this.props.fullscreenable
    const baseStyles = {
      border: 'none',
      background: 'transparent',
      zIndex: this.props.zIndex,
      transform: 'translateZ(0)',
      position: 'fixed',
      transitionDuration: `${transitionDuration}ms`,
      transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      transitionProperty: 'opacity, top, bottom',
      opacity: 0,
    }

    const mobileStyles = mobileFullscreen
      ? {
          left: this.props.visible ? '0px' : '-9999px',
          top: this.props.visible ? '0px' : '-9999px',
          background: '#FFF',
          margin: 0,
        }
      : {}

    return _.extend(
      {},
      baseStyles,
      this.getDefaultDimensions(),
      frameStyle,
      mobileStyles,
      modifiedStyles,
      this.props.fixedStyles
    )
  }

  getOffsetPosition = (animationOffset = 0) => {
    const { isMobile, name, horizontalPosition, verticalPosition, offset } = this.props

    if (isMobile && name === 'webWidget') return {}

    const mobileOffset = _.get(offset, 'mobile', {})
    const horizontalOffset = isMobile
      ? _.get(mobileOffset, 'horizontal', 0)
      : _.get(offset, 'horizontal', 0)
    const verticalOffset = isMobile
      ? _.get(mobileOffset, 'vertical', 0)
      : _.get(offset, 'vertical', 0)

    return {
      [horizontalPosition]: horizontalOffset,
      [verticalPosition]: parseInt(verticalOffset) + animationOffset,
    }
  }

  generateUserCSSWithColor = (color) => {
    return this.props.generateUserCSS(color)
  }

  onShowAnimationComplete = () => {
    if (this.props.name === 'webWidget') {
      this.props.widgetShowAnimationComplete()
    }
  }

  renderFrameContent = () => {
    const html = this.getContentDocument().documentElement
    const doc = this.getContentWindow().document

    // In order for iframe to correctly render in some browsers
    // we need to wait for readyState to be complete
    this.updateFrameLocale()
    this.constructEmbed(html, doc)
    if (this.props.title) {
      this.updateFrameTitle(this.props.title)
    }
  }

  updateFrameRef = (iframe) => {
    if (!iframe) {
      return
    }
    this.iframe = iframe
    this.updateFrameLocale()
  }

  render = () => {
    const iframeNamespace = 'zEWidget'
    const frameClasses = `${iframeNamespace}-${this.props.name}`
    const activeClasses = this.props.visible ? `${frameClasses}--active` : ''
    const tabIndex = this.props.visible ? '0' : '-1'
    const transitionStyles = {
      entering: {
        opacity: 0,
        ...this.getOffsetPosition(0),
      },
      entered: {
        opacity: 1,
        ...this.getOffsetPosition(0),
      },
      exiting: {
        opacity: 0,
        ...this.getOffsetPosition(-20),
      },
      exited: {
        opacity: 0,
        top: '-9999px',
        visibility: 'hidden',
      },
    }

    return (
      <Transition
        in={this.props.visible || this.props.alwaysShow}
        timeout={transitionDuration}
        onEntered={this.onShowAnimationComplete}
      >
        {(status) => (
          <IFrame
            title={this.props.title || this.props.name}
            style={{
              ...this.computeIframeStyle(),
              ...transitionStyles[status],
            }}
            ref={this.updateFrameRef}
            id={this.props.name}
            tabIndex={tabIndex}
            className={`${frameClasses} ${activeClasses}`}
            rootElement={this.iframeRoot}
          >
            <EmbedWrapper
              ref={(el) => {
                this.child = el
              }}
              document={this.getContentDocument()}
              baseCSS={`${this.props.rawCSS} ${this.generateUserCSSWithColor(
                this.props.color
              )} ${baseFontCSS}`}
              customCSS={this.state.customCSS}
              reduxStore={this.props.store}
              handleBackClick={this.back}
              preventClose={this.props.preventClose}
              useBackButton={this.props.useBackButton}
              hideNavigationButtons={this.props.hideNavigationButtons}
              name={this.props.name}
              fullscreen={this.props.fullscreen}
              isMobile={this.props.isMobile}
              chatStandalone={this.props.chatStandalone}
              dataTestId={this.props.horizontalPosition === 'left' ? TEST_IDS.LEFT : TEST_IDS.RIGHT}
            >
              {cloneElement(this.props.children, {
                onBackButtonClick: this.back,
              })}
            </EmbedWrapper>
          </IFrame>
        )}
      </Transition>
    )
  }
}

const actionCreators = {
  widgetShowAnimationComplete,
}

export default connect(mapStateToProps, actionCreators, null, { forwardRef: true })(Frame)
