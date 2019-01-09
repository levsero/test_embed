// Needed for legacy browsers as specified in
// https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es6/map';
import 'core-js/es6/set';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { StyleSheetManager } from 'styled-components';

import { locals as styles } from './Frame.scss';

import { EmbedWrapper } from 'component/frame/EmbedWrapper';
import { i18n } from 'service/i18n';
import {
  getZoomSizingRatio,
} from 'utility/devices';
import Transition from 'react-transition-group/Transition';
import {
  updateWidgetShown,
  widgetShowAnimationComplete,
  widgetHideAnimationComplete } from 'src/redux/modules/base/base-actions';
import {
  getFixedStyles,
  getColor,
  getHorizontalPosition,
  getFrameVisible,
  getFrameStyle } from 'src/redux/modules/selectors';
import {
  FONT_SIZE,
  MAX_WIDGET_HEIGHT,
  MIN_WIDGET_HEIGHT,
  WIDGET_WIDTH,
  FRAME_TRANSITION_DURATION } from 'constants/shared';
import { getChatStandalone } from 'src/redux/modules/base/base-selectors';
import {
  getStylingOffset,
  getStylingPositionVertical,
  getStylingZIndex
} from 'src/redux/modules/settings/settings-selectors';

// Unregister lodash from window._
if (!__DEV__) {
  _.noConflict();
}

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
    zIndex: getStylingZIndex(state)
  };
};

const scrollingStyleDelay = 50; // small delay so that safari has finished rendering
const sizingRatio = FONT_SIZE * getZoomSizingRatio();
const baseFontCSS = `html { font-size: ${sizingRatio}px }`;
const transitionDuration = FRAME_TRANSITION_DURATION;

const marginPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
]);

class Frame extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
    offset: PropTypes.shape({
      horizontal: PropTypes.number,
      vertical: PropTypes.number,
      mobile: PropTypes.shape({
        horizontal: PropTypes.number,
        vertical: PropTypes.number,
      })
    }).isRequired,
    afterShowAnimate: PropTypes.func,
    css: PropTypes.string,
    frameStyleModifier: PropTypes.func,
    frameOffsetWidth: PropTypes.number,
    frameOffsetHeight: PropTypes.number,
    frameStyle: PropTypes.shape({
      height: PropTypes.string,
      marginBottom: marginPropType,
      marginLeft: marginPropType,
      marginRight: marginPropType,
      marginTop: marginPropType,
      minHeight: PropTypes.string,
      zIndex: PropTypes.number
    }).isRequired,
    fullscreenable: PropTypes.bool,
    hideNavigationButtons: PropTypes.bool,
    alwaysShow: PropTypes.bool,
    name: PropTypes.string,
    onBack: PropTypes.func,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    horizontalPosition: PropTypes.oneOf(['right', 'left']),
    verticalPosition: PropTypes.oneOf(['top', 'bottom']),
    preventClose: PropTypes.bool,
    useBackButton: PropTypes.bool,
    visible: PropTypes.bool,
    title: PropTypes.string,
    fixedStyles: PropTypes.shape({
      height: marginPropType,
      bottom:  PropTypes.oneOf([0]),
      top: PropTypes.oneOf(['initial']),
      background: PropTypes.oneOf(['transparent']),
      maxHeight: PropTypes.string
    }),
    updateWidgetShown: PropTypes.func,
    widgetHideAnimationComplete: PropTypes.func,
    widgetShowAnimationComplete: PropTypes.func,
    color: PropTypes.shape({
      base: PropTypes.string,
      text: PropTypes.string
    }),
    generateUserCSS: PropTypes.func,
    chatStandalone: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    customFrameStyle: PropTypes.shape({
      height: PropTypes.string,
      marginBottom: marginPropType,
      marginLeft: marginPropType,
      marginRight: marginPropType,
      marginTop: marginPropType,
      minHeight: PropTypes.string,
      zIndex: PropTypes.number
    }),
    zIndex: PropTypes.number,
  }

  static defaultProps = {
    afterShowAnimate: () => {},
    css: '',
    frameStyleModifier: () => {},
    frameOffsetWidth: 15,
    frameOffsetHeight: 15,
    customFrameStyle: {},
    fullscreenable: false,
    hideNavigationButtons: false,
    name: '',
    alwaysShow: false,
    onBack: () => {},
    onHide: () => {},
    onShow: () => {},
    preventClose: false,
    store: { dispatch: () => {} },
    useBackButton: false,
    visible: true,
    title: '',
    fixedStyles: {},
    updateWidgetShown: () => {},
    widgetHideAnimationComplete: () => {},
    widgetShowAnimationComplete: () => {},
    generateUserCSS: () => {},
    chatStandalone: false,
    isMobile: false
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      childRendered: false,
      hiddenByZoom: false
    };

    this.child = null;
    this.iframe = null;
    this.renderQueued = false;
    this.queue = [];
  }

  componentDidMount = () => {
    this.renderFrameContent();
  }

  componentWillReceiveProps = (nextProps) => {
    const prevProps = this.props;

    if (prevProps.visible && !nextProps.visible) {
      this.waitForRender(this.hide);
    } else if (!prevProps.visible && nextProps.visible) {
      this.waitForRender(this.show);
    }

    if (!_.isEqual(nextProps.color, prevProps.color)) {
      this.waitForRender(() => {
        this.setCustomCSS(this.generateUserCSSWithColor(nextProps.color));
      });
    }
  }

  componentDidUpdate = () => {
    this.renderFrameContent();
    this.setCustomCSS(this.generateUserCSSWithColor(this.props.color));
  }

  componentWillUnmount = () => {
    ReactDOM.unmountComponentAtNode(this.getContentDocument().body);
  }

  getContentDocument = () => {
    return this.iframe.contentDocument;
  }

  getContentWindow = () => {
    return this.iframe.contentWindow;
  }

  getRootComponentElement = () => {
    return this.child.embed;
  }

  getRootComponent = () => {
    if (this.child) {
      const rootComponent = this.child.refs.rootComponent;

      return rootComponent.getWrappedInstance
        ? rootComponent.getWrappedInstance()
        : rootComponent;
    }
  }

  getChild = () => {
    return this.child;
  }

  getFrameHead = () => {
    return this.getContentDocument().head;
  }

  waitForRender = (callback) => {
    if (this.child) {
      callback();
    } else {
      this.queue.push(callback);
    }
  };

  flushQueue = () => {
    setTimeout(() => {
      this.queue.forEach((callback) => {
        callback();
      });
      this.queue = [];
    }, 0);
  };

  updateFrameLocale = () => {
    const html = this.getContentDocument().documentElement;
    const direction = i18n.isRTL() ? 'rtl' : 'ltr';

    // Need to defer to the next tick because Firefox renders differently
    setTimeout(() => {
      html.setAttribute('lang', i18n.getLocale());
      html.setAttribute('dir', direction);
    }, 0);

    if (this.child) {
      this.forceUpdateWorld();
    }
  }

  forceUpdateWorld = () => {
    this.child.forceUpdate();
    this.child.nav.forceUpdate();
    const embed = this.getRootComponent();

    if (embed.getActiveComponent) {
      const activeComponent = embed.getActiveComponent();

      if (activeComponent) activeComponent.forceUpdate();
    }

    _.defer(this.forceUpdate.bind(this));
  }

  updateFrameTitle = (title) => {
    const doc = this.getContentDocument();

    this.iframe.title = doc.title = title;
  }

  getDefaultDimensions = () => {
    const {
      frameOffsetHeight,
      frameOffsetWidth,
      fullscreenable,
      fullscreen,
      isMobile,
      horizontalPosition } = this.props;
    const isLeft = horizontalPosition === 'left';

    let fullscreenStyle = {
      width: '100%',
      maxWidth: '100%',
      height: '100%'
    };

    if (fullscreen && !isMobile) {
      fullscreenStyle = {
        ...fullscreenStyle,
        [horizontalPosition]: isLeft ? fullscreenStyle.position : '50%',
        background: '#EEE'
      };
    }
    const popoverStyle = {
      width: `${WIDGET_WIDTH + frameOffsetWidth}px`,
      height: '100%',
      maxHeight: `${MAX_WIDGET_HEIGHT + frameOffsetHeight}px`,
      minHeight: `${MIN_WIDGET_HEIGHT}px`
    };

    if ((fullscreen || isMobile) && fullscreenable) {
      return fullscreenStyle;
    } else {
      return popoverStyle;
    }
  };

  updateBaseFontSize = (fontSize) => {
    const htmlElem = this.getContentDocument().documentElement;

    htmlElem.style.fontSize = fontSize;
  }

  show = () => {
    const frameFirstChild = this.getRootComponentElement();

    setTimeout(() => {
      const existingStyle = frameFirstChild.style;

      if (!existingStyle.webkitOverflowScrolling) {
        existingStyle.webkitOverflowScrolling = 'touch';
      }
    }, scrollingStyleDelay);

    this.props.onShow(this);
    this.props.afterShowAnimate(this);

    if (this.props.name !== 'launcher') {
      this.props.updateWidgetShown(true);
    }
  }

  hide = (options = {}) => {
    const { onHide, updateWidgetShown } = this.props;

    onHide(this);
    if (options.onHide) options.onHide();
    this.props.widgetHideAnimationComplete();

    if (this.props.name !== 'launcher') {
      updateWidgetShown(false);
    }
  }

  back = (e) => {
    e.preventDefault();
    this.props.onBack(this);
  }

  setHiddenByZoom = (hiddenByZoom) => {
    this.setState({ hiddenByZoom });
  }

  setButtonColor = (color) => {
    this.child.setButtonColor(color);
  }

  setCustomCSS = (css) => {
    if (this.child) this.child.setCustomCSS(css);
  }

  applyMobileBodyStyle = () => {
    const frameDoc = this.getContentDocument();
    const fullscreenStyles = [
      'width: 100%',
      'height: 100%',
      'overflow-x: hidden'
    ].join(';');

    frameDoc.body.firstChild.setAttribute('style', fullscreenStyles);
  }

  computeIframeStyle = () => {
    const frameStyle = _.defaults({}, this.props.customFrameStyle, this.props.frameStyle);
    const modifiedStyles = this.child
      ? this.props.frameStyleModifier(frameStyle, this.getRootComponentElement()) || frameStyle
      : frameStyle;
    const mobileFullscreen = this.props.isMobile && this.props.fullscreenable;
    const baseStyles = {
      border: 'none',
      background: 'transparent',
      zIndex: this.props.zIndex,
      transform: 'translateZ(0)',
      position: 'fixed',
      transition: `all ${transitionDuration}ms cubic-bezier(0.645, 0.045, 0.355, 1)`,
      transitionProperty: 'opacity, top, bottom',
      opacity: 0
    };

    const mobileStyles = mobileFullscreen ? {
      left: this.props.visible ? '0px' : '-9999px',
      top: this.props.visible ? '0px' : '-9999px',
      background:'#FFF',
      margin: 0
    } : {};

    return _.extend({},
      baseStyles,
      this.getDefaultDimensions(),
      frameStyle,
      mobileStyles,
      modifiedStyles,
      this.props.fixedStyles
    );
  }

  getOffsetPosition = (animationOffset = 0) => {
    const { isMobile, name, horizontalPosition, verticalPosition, offset } = this.props;

    if (isMobile && name === 'webWidget') return {};

    const mobileOffset = _.get(offset, 'mobile', {});
    const horizontalOffset = isMobile ? _.get(mobileOffset, 'horizontal', 0) : _.get(offset, 'horizontal', 0);
    const verticalOffset = isMobile ? _.get(mobileOffset, 'vertical', 0) : _.get(offset, 'vertical', 0);

    return {
      [horizontalPosition]: horizontalOffset,
      [verticalPosition]: parseInt(verticalOffset) + animationOffset
    };
  }

  injectEmbedIntoFrame = (embed) => {
    const { isMobile, fullscreenable, fullscreen, horizontalPosition } = this.props;
    const doc = this.getContentDocument();

    // element within the iframe to inject the embed into
    const element = doc.body.appendChild(doc.createElement('div'));
    // element styles
    const mobileFullscreen = fullscreenable && isMobile;

    const desktopClasses = mobileFullscreen ? '' : styles.desktop;
    const positionClasses = horizontalPosition === 'left' ? styles.left : styles.right;

    if (fullscreen) {
      element.style.minWidth = '100%';
    }

    element.className = `${positionClasses} ${desktopClasses}`;
    ReactDOM.render(embed, element);
    this.setState({ childRendered: true });

    if (mobileFullscreen) {
      setTimeout(this.applyMobileBodyStyle, 0);
    }
    this.flushQueue();
  }

  generateUserCSSWithColor = (color) => {
    return this.props.generateUserCSS(color);
  }

  constructEmbed = () => {
    const newChild = React.cloneElement(this.props.children, {
      forceUpdateWorld: this.forceUpdateWorld,
      onBackButtonClick: this.back,
      getFrameContentDocument: this.getContentDocument
    });

    const wrapper = (
      <StyleSheetManager target={this.getContentDocument().head}>
        <EmbedWrapper
          ref={(el) => { this.child = el; }}
          document={this.getContentDocument()}
          baseCSS={`${this.props.css} ${this.generateUserCSSWithColor(this.props.color)} ${baseFontCSS}`}
          reduxStore={this.props.store}
          handleBackClick={this.back}
          preventClose={this.props.preventClose}
          useBackButton={this.props.useBackButton}
          hideNavigationButtons={this.props.hideNavigationButtons}
          name={this.props.name}
          fullscreen={this.props.fullscreen}
          isMobile={this.props.isMobile}
          chatStandalone={this.props.chatStandalone}>
          {newChild}
        </EmbedWrapper>
      </StyleSheetManager>
    );

    this.injectEmbedIntoFrame(wrapper);
  }

  onShowAnimationComplete = () => {
    if (this.props.name === 'webWidget') {
      this.props.widgetShowAnimationComplete();
    }
  }

  renderFrameContent = () => {
    if (this.state.childRendered) {
      return false;
    }

    const html = this.getContentDocument().documentElement;
    const doc = this.getContentWindow().document;

    // In order for iframe to correctly render in some browsers
    // we need to wait for readyState to be complete
    if (doc.readyState === 'complete') {
      this.renderQueued = false;
      this.updateFrameLocale();
      this.constructEmbed(html, doc);
      if (this.props.title) {
        this.updateFrameTitle(this.props.title);
      }
    } else {
      if (!this.renderQueued) {
        setTimeout(this.renderFrameContent, 0);
      }
      this.renderQueued = true;
    }
  }

  render = () => {
    const iframeNamespace = 'zEWidget';
    const frameClasses = `${iframeNamespace}-${this.props.name}`;
    const activeClasses = this.props.visible ? `${frameClasses}--active` : '';
    const tabIndex = this.props.visible ? '0' : '-1';
    const transitionStyles = {
      entering: {
        opacity: 0,
        ...this.getOffsetPosition(-20)
      },
      entered:  {
        opacity: 1,
        ...this.getOffsetPosition(0)
      },
      exiting: {
        opacity: 0,
        ...this.getOffsetPosition(-20)
      },
      exited: {
        top: '-9999px'
      }
    };

    return (
      <Transition
        in={this.props.visible || this.props.alwaysShow}
        timeout={transitionDuration}
        onEntered={this.onShowAnimationComplete}>
        {(status) => (
          <iframe
            title={this.props.title || this.props.name}
            style={{ ...this.computeIframeStyle(), ...transitionStyles[status] }}
            ref={(el) => { this.iframe = el; }}
            id={this.props.name}
            tabIndex={tabIndex}
            className={`${frameClasses} ${activeClasses}`} />
        )}
      </Transition>
    );
  }
}

const actionCreators = {
  updateWidgetShown,
  widgetHideAnimationComplete,
  widgetShowAnimationComplete
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Frame);
