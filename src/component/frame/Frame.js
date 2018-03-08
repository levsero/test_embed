// Needed for legacy browsers as specified in
// https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es6/map';
import 'core-js/es6/set';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { locals as styles } from './Frame.scss';

import { EmbedWrapper } from 'component/frame/EmbedWrapper';
import { i18n } from 'service/i18n';
import { settings } from 'service/settings';
import { transitionFactory } from 'service/transitionFactory';
import { clickBusterRegister,
         getZoomSizingRatio,
         isMobileBrowser } from 'utility/devices';
import { win } from 'utility/globals';
import { cssTimeToMs } from 'utility/utils';
import { updateWidgetShown, widgetHideAnimationComplete } from 'src/redux/modules/base/base-actions';

// Unregister lodash from window._
if (!__DEV__) {
  _.noConflict();
}

const scrollingStyleDelay = 50; // small delay so that safari has finished rendering
const sizingRatio = 12 * getZoomSizingRatio();
const baseFontCSS = `html { font-size: ${sizingRatio}px }`;
const zIndex = settings.get('zIndex');
const isPositionTop = settings.get('position.vertical') === 'top';
const defaultHideTransition = isPositionTop
                            ? transitionFactory.webWidget.upHide()
                            : transitionFactory.webWidget.downHide();
const defaultShowTransition = isPositionTop
                            ? transitionFactory.webWidget.downShow()
                            : transitionFactory.webWidget.upShow();
const defaultMarginTop = isPositionTop && !isMobileBrowser() ? '15px' : 0;

export class Frame extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
    afterShowAnimate: PropTypes.func,
    css: PropTypes.string,
    frameStyleModifier: PropTypes.func,
    frameFullWidth: PropTypes.number,
    frameOffsetWidth: PropTypes.number,
    frameOffsetHeight: PropTypes.number,
    frameStyle: PropTypes.object,
    fullscreenable: PropTypes.bool,
    hideCloseButton: PropTypes.bool,
    name: PropTypes.string,
    onBack: PropTypes.func,
    onClose: PropTypes.func,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    position: PropTypes.string,
    preventClose: PropTypes.bool,
    useBackButton: PropTypes.bool,
    transitions: PropTypes.object,
    visible: PropTypes.bool
  }

  static defaultProps = {
    afterShowAnimate: () => {},
    css: '',
    frameStyleModifier: () => {},
    frameFullWidth: 0,
    frameOffsetWidth: 15,
    frameOffsetHeight: 15,
    frameStyle: { marginTop: defaultMarginTop },
    fullscreenable: false,
    hideCloseButton: false,
    name: '',
    onBack: () => {},
    onClose: () => {},
    onHide: () => {},
    onShow: () => {},
    position: 'right',
    preventClose: false,
    store: { dispatch: () => {} },
    useBackButton: false,
    transitions: {},
    visible: true
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      childRendered: false,
      frameStyle: props.frameStyle,
      hiddenByZoom: false,
      iframeDimensions: {
        height: 0,
        width: 0
      },
      visible: props.visible
    };

    this.child = null;
    this.iframe = null;
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

  getFrameDimensions = () => {
    return this.state.iframeDimensions;
  }

  updateFrameLocale = () => {
    const html = this.getContentDocument().documentElement;
    const direction = i18n.isRTL() ? 'rtl' : 'ltr';

    // Need to defer to the next tick because Firefox renders differently
    setTimeout(() => {
      html.setAttribute('lang', i18n.getLocale());
      html.setAttribute('dir', direction);
    }, 0);

    if (this.child) {
      this.child.forceUpdate();
      this.child.nav.forceUpdate();
    }
  }

  updateFrameSize = () => {
    const frameDoc = this.getContentDocument();
    const fullscreenWidth = `${win.innerWidth}px`;

    if (!frameDoc.firstChild) {
      return false;
    }

    const getDimensions = () => {
      const { frameFullWidth, frameOffsetHeight, frameOffsetWidth, fullscreenable } = this.props;
      const el = this.getRootComponentElement();
      const width  = Math.max(el.clientWidth, el.offsetWidth);
      const height = Math.max(el.clientHeight, el.offsetHeight);
      const fullscreen = isMobileBrowser() && fullscreenable;
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
        width: (_.isFinite(width) ? width : 0) + frameOffsetWidth,
        height: (_.isFinite(height) ? height : 0) + frameOffsetHeight
      };

      // Set a full width frame with a dynamic height
      if (frameFullWidth) {
        return {
          width: '100%',
          height: (_.isFinite(height) ? height : 0) + frameOffsetHeight
        };
      }

      return fullscreen
           ? fullscreenStyle
           : popoverStyle;
    };

    if (this.props.fullscreenable && isMobileBrowser()) {
      const fullscreenStyles = [
        `width: ${fullscreenWidth}`,
        'height: 100%',
        'overflow-x: hidden'
      ].join(';');

      frameDoc.body.firstChild.setAttribute('style', fullscreenStyles);
    }

    const dimensions = getDimensions();
    const frameWin = this.getContentWindow();

    frameWin.setTimeout(() => this.setState({ iframeDimensions: dimensions }), 0);
    return dimensions;
  }

  updateBaseFontSize = (fontSize) => {
    const htmlElem = this.getContentDocument().documentElement;

    htmlElem.style.fontSize = fontSize;
  }

  show = (options = {}) => {
    const { dispatch } = this.props.store;
    const frameFirstChild = this.getRootComponentElement();
    const transition = this.props.transitions[options.transition] || defaultShowTransition;
    const animateFrom = _.extend({}, this.state.frameStyle, transition.start);
    const animateTo = _.extend({}, this.state.frameStyle, transition.end);

    this.setState({ visible: true });

    setTimeout(() => {
      const existingStyle = frameFirstChild.style;

      if (!existingStyle.webkitOverflowScrolling) {
        existingStyle.webkitOverflowScrolling = 'touch';
      }
    }, scrollingStyleDelay);

    if (options.transition === 'none') {
      this.props.afterShowAnimate(this);
    } else {
      this.setState({ frameStyle: animateFrom });
      setTimeout(() => this.setState({ frameStyle: animateTo }), 0);

      setTimeout(
        () => this.props.afterShowAnimate(this),
        cssTimeToMs(transition.end.transitionDuration)
      );
    }

    this.props.onShow(this);

    dispatch(updateWidgetShown(this.props.name === 'launcher'));
  }

  hide = (options = {}) => {
    const { onHide, transitions, store } = this.props;
    const hideFinished = () => {
      this.setState({ visible: false });
      onHide(this);
      store.dispatch(widgetHideAnimationComplete());
    };

    if (options.transition === 'none') {
      hideFinished();
    } else {
      const transition = transitions[options.transition] || defaultHideTransition;
      const frameStyle = _.extend({}, this.state.frameStyle, transition.end);

      this.setState({ frameStyle });

      setTimeout(() => {
        hideFinished();
      }, cssTimeToMs(transition.end.transitionDuration));
    }
  }

  close = (e, options = {}) => {
    if (this.props.preventClose) return;

    // e.touches added for automation testing mobile browsers
    // which is firing 'click' event on iframe close
    if (isMobileBrowser() && e.touches) {
      clickBusterRegister(e.touches[0].clientX, e.touches[0].clientY);
    }

    const transition = isPositionTop ? 'upHide' : 'downHide';

    this.hide({ transition });

    this.props.onClose(this, options);
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

  computeIframeStyle = () => {
    const { iframeDimensions, visible, hiddenByZoom, frameStyle } = this.state;
    const modifiedStyles = this.props.frameStyleModifier(frameStyle) || frameStyle;
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
    const isMobile = isMobileBrowser();
    const offset = settings.get('offset');
    const mobileOffset = _.get(offset, 'mobile', {});
    const horizontalOffset = isMobile ? _.get(mobileOffset, 'horizontal', 0) : _.get(offset, 'horizontal', 0);
    const verticalOffset = isMobile ? _.get(mobileOffset, 'vertical', 0) : _.get(offset, 'vertical', 0);
    const horizontalPos = settings.get('position.horizontal') || this.props.position;
    const verticalPos = isPositionTop ? 'top' : 'bottom';

    const posObj = (isMobile && this.props.name === 'webWidget') ? {} : {
      [horizontalPos]: horizontalOffset,
      [verticalPos]: verticalOffset
    };

    return _.extend({},
      baseStyles,
      frameStyle,
      modifiedStyles,
      iframeDimensions,
      posObj,
      visibilityStyles
    );
  }

  injectEmbedIntoFrame = (embed) => {
    const doc = this.getContentDocument();

    // element within the iframe to inject the embed into
    const element = doc.body.appendChild(doc.createElement('div'));

    // element styles
    const fullscreen = this.props.fullscreenable && isMobileBrowser();
    const position = settings.get('position.horizontal') || this.props.position;
    const desktopClasses = fullscreen ? '' : styles.desktop;
    const positionClasses = position === 'left' ? styles.left : styles.right;

    element.className = `${positionClasses} ${desktopClasses}`;
    ReactDOM.render(embed, element);
    this.setState({ childRendered: true });
  }

  constructEmbed = () => {
    // Pass down updateFrameSize to children
    const newChild = React.cloneElement(this.props.children, {
      updateFrameSize: this.updateFrameSize,
      closeFrame: this.close,
      getFrameDimensions: this.getFrameDimensions
    });

    const wrapper = (
      <EmbedWrapper
        ref={(el) => { this.child = el; }}
        baseCSS={`${this.props.css} ${baseFontCSS}`}
        reduxStore={this.props.store}
        handleBackClick={this.back}
        handleCloseClick={this.close}
        useBackButton={this.props.useBackButton}
        updateFrameSize={this.updateFrameSize}
        hideCloseButton={this.props.hideCloseButton}
        name={this.props.name}
        fullscreen={this.props.fullscreenable && isMobileBrowser()}>
        {newChild}
      </EmbedWrapper>
    );

    this.injectEmbedIntoFrame(wrapper);
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
      this.updateFrameLocale();
      this.constructEmbed(html, doc);
    } else {
      setTimeout(this.renderFrameContent, 0);
    }
  }

  render = () => {
    const iframeNamespace = 'zEWidget';
    const frameClasses = `${iframeNamespace}-${this.props.name}`;
    const activeClasses = this.state.visible ? `${frameClasses}--active` : '';
    const tabIndex = this.state.visible ? '0' : '-1';

    return (
      <iframe
        style={this.computeIframeStyle()}
        ref={(el) => { this.iframe = el; }}
        id={this.props.name}
        tabIndex={tabIndex}
        className={`${frameClasses} ${activeClasses}`} />
    );
  }
}
