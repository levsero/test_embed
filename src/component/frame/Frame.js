// Needed for legacy browsers as specified in
// https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es6/map';
import 'core-js/es6/set';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { StyleSheetManager } from 'styled-components';

import { locals as styles } from './Frame.scss';

import { EmbedWrapper } from 'component/frame/EmbedWrapper';
import { i18n } from 'service/i18n';
import { settings } from 'service/settings';
import { clickBusterRegister,
  getZoomSizingRatio,
  isMobileBrowser } from 'utility/devices';
import { win } from 'utility/globals';
import Transition from 'react-transition-group/Transition';
import { updateWidgetShown, widgetHideAnimationComplete } from 'src/redux/modules/base/base-actions';
import { FONT_SIZE } from 'constants/shared';

// Unregister lodash from window._
if (!__DEV__) {
  _.noConflict();
}

const scrollingStyleDelay = 50; // small delay so that safari has finished rendering
const sizingRatio = FONT_SIZE * getZoomSizingRatio();
const baseFontCSS = `html { font-size: ${sizingRatio}px }`;
const zIndex = settings.get('zIndex');
const isPositionTop = settings.get('position.vertical') === 'top';
const transitionDuration = 250;
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
    visible: PropTypes.bool,
    title: PropTypes.string
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
    visible: true,
    title: ''
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
      visible: props.visible,
      fixedStyles: {}
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

  getFrameHead = () => {
    return this.getContentDocument().head;
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

  updateFrameTitle = (title) => {
    const doc = this.getContentDocument();

    this.iframe.title = doc.title = title;
  }

  setFixedFrameStyles = (fixedStyles = {}) => {
    this.setState({ fixedStyles });
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
        top: this.state.visible ? '0px' : '-9999px',
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

  show = () => {
    const { dispatch } = this.props.store;
    const frameFirstChild = this.getRootComponentElement();

    this.setState({ visible: true });

    setTimeout(() => {
      const existingStyle = frameFirstChild.style;

      if (!existingStyle.webkitOverflowScrolling) {
        existingStyle.webkitOverflowScrolling = 'touch';
      }
    }, scrollingStyleDelay);

    this.props.onShow(this);
    this.props.afterShowAnimate(this);

    if (this.props.name !== 'launcher') {
      dispatch(updateWidgetShown(true));
    }
  }

  hide = (options = {}) => {
    const { dispatch } = this.props.store;
    const { onHide, store } = this.props;
    const hideFinished = () => {
      this.setState({ visible: false });
      onHide(this);
      if (options.onHide) options.onHide();
      store.dispatch(widgetHideAnimationComplete());
    };

    hideFinished();
    if (this.props.name !== 'launcher') {
      dispatch(updateWidgetShown(false));
    }
  }

  close = (e = {}, options = {}) => {
    if (this.props.preventClose) return;

    // e.touches added for automation testing mobile browsers
    // which is firing 'click' event on iframe close
    if (isMobileBrowser() && e.touches) {
      clickBusterRegister(e.touches[0].clientX, e.touches[0].clientY);
    }

    this.hide({ onHide: options.onHide });

    if (!options.skipOnClose) {
      this.props.onClose(this, options);
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

  computeIframeStyle = () => {
    const { iframeDimensions, frameStyle } = this.state;
    const modifiedStyles = this.props.frameStyleModifier(frameStyle) || frameStyle;
    const baseStyles = {
      border: 'none',
      background: 'transparent',
      zIndex: zIndex,
      transform: 'translateZ(0)',
      position: 'fixed',
      transition: `all ${transitionDuration}ms cubic-bezier(0.645, 0.045, 0.355, 1)`,
      transitionProperty: 'opacity, top, bottom',
      opacity: 0
    };

    return _.extend({},
      baseStyles,
      frameStyle,
      modifiedStyles,
      iframeDimensions,
      this.state.fixedStyles
    );
  }

  getOffsetPosition = (animationOffset = 0) => {
    const isMobile = isMobileBrowser();

    if (isMobile && this.props.name === 'webWidget') return {};

    const offset = settings.get('offset');
    const mobileOffset = _.get(offset, 'mobile', {});
    const horizontalOffset = isMobile ? _.get(mobileOffset, 'horizontal', 0) : _.get(offset, 'horizontal', 0);
    const verticalOffset = isMobile ? _.get(mobileOffset, 'vertical', 0) : _.get(offset, 'vertical', 0);
    const horizontalPos = settings.get('position.horizontal') || this.props.position;
    const verticalPos = isPositionTop ? 'top' : 'bottom';

    return {
      [horizontalPos]: horizontalOffset,
      [verticalPos]: parseInt(verticalOffset) + animationOffset
    };
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
      setFixedFrameStyles: this.setFixedFrameStyles,
      closeFrame: this.close,
      getFrameDimensions: this.getFrameDimensions,
      onBackButtonClick: this.back,
      getFrameContentDocument: this.getContentDocument
    });

    const wrapper = (
      <StyleSheetManager target={this.getContentDocument().head}>
        <EmbedWrapper
          ref={(el) => { this.child = el; }}
          document={this.getContentDocument()}
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
      </StyleSheetManager>
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
      if (this.props.title) {
        this.updateFrameTitle(this.props.title);
      }
    } else {
      setTimeout(this.renderFrameContent, 0);
    }
  }

  render = () => {
    const iframeNamespace = 'zEWidget';
    const frameClasses = `${iframeNamespace}-${this.props.name}`;
    const activeClasses = this.state.visible ? `${frameClasses}--active` : '';
    const tabIndex = this.state.visible ? '0' : '-1';
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
      <Transition in={this.state.visible} timeout={transitionDuration}>
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
