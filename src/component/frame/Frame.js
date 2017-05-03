import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { locals as styles } from './Frame.sass';

import { EmbedWrapper } from 'component/frame/EmbedWrapper';
import { i18n } from 'service/i18n';
import { settings } from 'service/settings';
import { transitionFactory } from 'service/transitionFactory';
import { clickBusterRegister,
         getZoomSizingRatio,
         isMobileBrowser } from 'utility/devices';
import { win } from 'utility/globals';
import { cssTimeToMs } from 'utility/utils';

const baseCSS = require('baseCSS');
const mainCSS = require('mainCSS');

// Unregister lodash from window._
if (!__DEV__) {
  _.noConflict();
}

const sizingRatio = 12 * getZoomSizingRatio(false, true);
const baseFontCSS = `html { font-size: ${sizingRatio}px }`;
const zIndex = settings.get('zIndex');
const isPositionTop = settings.get('position.vertical') === 'top';
const defaultHideTransition = isPositionTop
                            ? transitionFactory.webWidget.upHide()
                            : transitionFactory.webWidget.downHide();
const defaultShowTransition = isPositionTop
                            ? transitionFactory.webWidget.downShow()
                            : transitionFactory.webWidget.upShow();

export class Frame extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
    callbacks: PropTypes.shape({
      afterShowAnimate: PropTypes.func,
      onBack: PropTypes.func,
      onClose: PropTypes.func,
      onHide: PropTypes.func,
      onShow: PropTypes.func
    }),
    css: PropTypes.string,
    extend: PropTypes.object,
    frameDimensions: PropTypes.shape({
      fullWidth: PropTypes.number,
      offsetWidth: PropTypes.number,
      offsetHeight: PropTypes.number
    }),
    frameStyle: PropTypes.object,
    name: PropTypes.string,
    options: {
      fullscreenable: PropTypes.bool,
      position: PropTypes.string,
      visible: PropTypes.bool
    },
    toggles: {
      hideCloseButton: PropTypes.bool,
      preventClose: PropTypes.bool
    },
    transitions: PropTypes.object
  }

  static defaultProps = {
    css: '',
    callbacks: {
      afterShowAnimate: () => {},
      onBack: () => {},
      onClose: () => {},
      onHide: () => {},
      onShow: () => {}
    },
    dimensions: {
      fullWidth: 0,
      offsetWidth: 15,
      offsetHeight: 15
    },
    frameStyle: {
      marginTop: isPositionTop && !isMobileBrowser() ? '15px' : 0
    },
    name: '',
    options: {
      fullscreenable: false,
      position: 'right',
      visible: true
    },
    toggles: {
      disableSetOffsetHorizontal: false,
      hideCloseButton: false,
      preventClose: false
    },
    transitions: {}
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: props.options.visible,
      frameStyle: props.frameStyle,
      hiddenByZoom: false,
      _rendered: false,
      iframeDimensions: {
        height: 0,
        width: 0
      }
    };

    this.child = null;
  }

  componentDidMount = () => {
    this.renderFrameContent();
  }

  componentDidUpdate = () => {
    this.renderFrameContent();
  }

  componentWillUnmount = () => {
    ReactDOM.unmountComponentAtNode(this.getContentDocument().body);
  }

  getContentDocument = () => {
    return ReactDOM.findDOMNode(this).contentDocument;
  }

  getContentWindow = () => {
    return ReactDOM.findDOMNode(this).contentWindow;
  }

  getRootComponentElement = () => {
    return this.getContentDocument().querySelector('#Embed').firstChild;
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

  updateFrameSize = () => {
    const frameWin = this.getContentWindow();
    const frameDoc = this.getContentDocument();
    const fullscreenWidth = `${win.innerWidth}px`;

    if (!frameDoc.firstChild) {
      return false;
    }

    const getDimensions = () => {
      const el = this.getRootComponentElement();
      const width  = Math.max(el.clientWidth, el.offsetWidth);
      const height = Math.max(el.clientHeight, el.offsetHeight);
      const fullscreen = isMobileBrowser() && this.props.options.fullscreenable;
      // FIXME shouldn't set background & zIndex in a dimensions object
      const fullscreenStyle = {
        width: '100%',
        maxWidth: fullscreenWidth,
        height: '100%',
        left: this.state.visible ? '0px' : '-9999px',
        background:'#FFF',
        zIndex: zIndex
      };
      const popoverStyle = {
        width: (_.isFinite(width) ? width : 0) + this.props.frameDimensions.offsetWidth,
        height: (_.isFinite(height) ? height : 0) + this.props.frameDimensions.offsetHeight
      };

      // Set a full width frame with a dynamic height
      if (this.props.frameDimensions.fullWidth) {
        return {
          width: '100%',
          height: (_.isFinite(height) ? height : 0) + this.props.frameDimensions.offsetHeight
        };
      }

      return fullscreen
            ? fullscreenStyle
            : popoverStyle;
    };

    if (this.props.options.fullscreenable && isMobileBrowser()) {
      frameDoc.body.firstChild.setAttribute(
        'style',
        [`width: ${fullscreenWidth}`,
        'height: 100%',
        'overflow-x: hidden'].join(';')
      );
    }

    const dimensions = getDimensions();

    frameWin.setTimeout(() => this.setState({ iframeDimensions: dimensions }), 0);
    return dimensions;
  }

  updateBaseFontSize = (fontSize) => {
    const htmlElem = this.getContentDocument().documentElement;

    htmlElem.style.fontSize = fontSize;
  }

  show = (options = {}) => {
    const frameFirstChild = this.getRootComponentElement();
    const transition = this.props.transitions[options.transition] || defaultShowTransition;
    const animateFrom = _.extend({}, this.state.frameStyle, transition.start);
    const animateTo = _.extend({}, this.state.frameStyle, transition.end);

    this.setState({ visible: true, frameStyle: animateFrom });

    setTimeout( () => {
      const existingStyle = frameFirstChild.style;

      if (!existingStyle.webkitOverflowScrolling) {
        existingStyle.webkitOverflowScrolling = 'touch';
      }
    }, 50);

    setTimeout(() => this.setState({ frameStyle: animateTo }), 0);

    setTimeout(
      () => this.props.callbacks.afterShowAnimate(this),
      cssTimeToMs(transition.end.transitionDuration)
    );

    this.props.callbacks.onShow(this);
  }

  hide = (options = {}) => {
    const transition = this.props.transitions[options.transition] || defaultHideTransition;
    const frameStyle = _.extend({}, this.state.frameStyle, transition.end);

    this.setState({ frameStyle });

    setTimeout(() => {
      this.setState({ visible: false });
      this.props.callbacks.onHide(this);
    }, cssTimeToMs(transition.end.transitionDuration));
  }

  close = (e, options = {}) => {
    if (this.props.toggles.preventClose) return;

    // e.touches added for automation testing mobile browsers
    // which is firing 'click' event on iframe close
    if (isMobileBrowser() && e.touches) {
      clickBusterRegister(e.touches[0].clientX, e.touches[0].clientY);
    }

    const transition = isPositionTop ? 'upHide' : 'downHide';

    this.hide({ transition });

    this.props.callbacks.onClose(this, options);
  }

  back = (e) => {
    e.preventDefault();
    this.props.callbacks.onBack(this);
  }

  setHiddenByZoom = (hiddenByZoom) => {
    this.setState({ hiddenByZoom });
  }

  setHighlightColor = (color) => {
    this.child.setHighlightColor(color);
  }

  setButtonColor = (color) => {
    this.child.setButtonColor(color);
  }

  computeIframeStyle = () => {
    const { iframeDimensions, visible, hiddenByZoom, frameStyle } = this.state;
    const baseStyles = {
      border: 'none',
      background: 'transparent',
      zIndex: zIndex,
      transform: 'translateZ(0)',
      position: 'fixed',
      opacity: 1
    };

    // Visibility
    const hiddenStyle = transitionFactory.hiddenState(iframeDimensions.height, isPositionTop);
    const visibilityStyles = (visible && !hiddenByZoom) ? null : hiddenStyle;

    // Position
    const offset = settings.get('offset');
    const horizontalOffset = (isMobileBrowser() || !offset) ? 0 : offset.horizontal;
    const verticalOffset = (isMobileBrowser() || !offset) ? 0 : offset.vertical;
    const horizontalPos = settings.get('position.horizontal') || this.props.options.position;
    const verticalPos = isPositionTop ? 'top' : 'bottom';
    const posObj = {
      [horizontalPos]: horizontalOffset,
      [verticalPos]: verticalOffset
    };

    return _.extend(
      baseStyles,
      posObj,
      frameStyle,
      iframeDimensions,
      visibilityStyles
    );
  }

  injectEmbedIntoFrame = (embed) => {
    const doc = this.getContentWindow().document;

    // element within the iframe to inject the embed into
    const element = doc.body.appendChild(doc.createElement('div'));

    // element styles
    const fullscreen = this.props.options.fullscreenable && isMobileBrowser();
    const position = settings.get('position.horizontal') || this.props.options.position;
    const desktopClasses = fullscreen ? '' : styles.desktop;
    const positionClasses = position === 'left' ? styles.left : styles.right;

    element.className = `${positionClasses} ${desktopClasses}`;

    this.child = ReactDOM.render(embed, element);

    this.setState({ _rendered: true });
  }

  constructEmbed = () => {
    const cssText = baseCSS + mainCSS + this.props.css + baseFontCSS;

    // Pass down updateFrameSize to children
    const newChild = React.cloneElement(this.props.children, {
      updateFrameSize: this.updateFrameSize
    });
    const wrapper = (
      <EmbedWrapper
        baseCSS={cssText}
        reduxStore={this.props.store}
        handleBackClick={this.back}
        handleCloseClick={this.close}
        updateFrameSize={this.updateFrameSize}
        hideCloseButton={this.props.toggles.hideCloseButton}
        name={this.props.name}
        fullscreen={this.props.options.fullscreenable && isMobileBrowser()}>
        {newChild}
      </EmbedWrapper>
    );

    this.injectEmbedIntoFrame(wrapper);
  }

  renderFrameContent = () => {
    if (this.state._rendered) {
      return false;
    }

    const html = this.getContentDocument().documentElement;
    const doc = this.getContentWindow().document;

    if (i18n.isRTL()) {
      html.setAttribute('lang', i18n.getLocale());
      html.setAttribute('dir', 'rtl');
    }

    // In order for iframe to correctly render in some browsers
    // we need to do it on nextTick
    if (doc.readyState === 'complete') {
      this.constructEmbed();
    } else {
      setTimeout(this.renderFrameContent, 0);
    }
  }

  render = () => {
    const iframeNamespace = 'zEWidget';
    const frameClasses = `${iframeNamespace}-${this.props.name}`;
    const activeClasses = this.state.visible ? `${frameClasses}--active` : '';

    return (
      <iframe
        style={this.computeIframeStyle()}
        id={this.props.name}
        className={`${frameClasses} ${activeClasses}`} />
    );
  }
}
