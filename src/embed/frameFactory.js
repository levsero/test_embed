import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { EmbedWrapper } from 'component/frameFactory/EmbedWrapper';
import { i18n } from 'service/i18n';
import { settings } from 'service/settings';
import { transitionFactory } from 'service/transitionFactory';
import { clickBusterRegister,
         getZoomSizingRatio,
         isMobileBrowser } from 'utility/devices';
import { win } from 'utility/globals';
import { cssTimeToMs } from 'utility/utils';

// Unregister lodash from window._
if (!__DEV__) {
  _.noConflict();
}

const baseCSS = require('baseCSS');
const mainCSS = require('mainCSS');
const sizingRatio = 12 * getZoomSizingRatio(false, true);
const baseFontCSS = `html { font-size: ${sizingRatio}px }`;
const expandedSetting = settings.get('expanded');
const isSettingsTop = settings.get('position.vertical') === 'top';
const isMobile = isMobileBrowser();
const zIndex = settings.get('zIndex');
const isPositionTop = isSettingsTop; //|| this.props.params.name === 'ipm';
const defaultHideTransition = isPositionTop
                            ? transitionFactory.webWidget.upHide()
                            : transitionFactory.webWidget.downHide();
const defaultShowTransition = isPositionTop
                            ? transitionFactory.webWidget.downShow()
                            : transitionFactory.webWidget.upShow();
let expanded = expandedSetting;

export class Frame extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: this.props.visible,
      frameStyle: this.props.params.frameStyle,
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
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).contentDocument.body);
  }

  getChild = () => {
    return this.child;
  }

  getRootComponent = () => {
    if (this.child) {
      const rootComponent = this.child.refs.rootComponent;

      return rootComponent.getWrappedInstance
            ? rootComponent.getWrappedInstance()
            : rootComponent;
    }
  }

  setOffsetHorizontal = (offsetValue = 0) => {
    if (!this.props.params.disableSetOffsetHorizontal) {
      ReactDOM.findDOMNode(this).style.marginLeft = `${offsetValue}px`;
      ReactDOM.findDOMNode(this).style.marginRight = `${offsetValue}px`;
    }
  }

  setFrameSize = (width, height, transparent = true) => {
    const iframe = ReactDOM.findDOMNode(this);
    const frameWin = iframe.contentWindow;
    const frameDoc = iframe.contentDocument;
    // FIXME shouldn't set background & zIndex in a dimensions object
    const dimensions = {
      height: height,
      width: width,
      zIndex: zIndex,
      // FIXME addresses combination of dropshadow & margin & white background on iframe
      background: transparent ? 'linear-gradient(transparent, #FFFFFF)' : '#fff'
    };

    if (this.props.params.fullscreenable) {
      frameDoc.body.firstChild.setAttribute(
        'style',
        ['width: 100%',
        'height: 100%',
        'overflow-x: hidden'].join(';')
      );
    }

    frameWin.setTimeout(
      () => this.setState(
        { iframeDimensions: _.extend(this.state.iframeDimensions, dimensions) }
      ), 0);
  }

  updateFrameSize = () => {
    const iframe = ReactDOM.findDOMNode(this);
    const frameWin = iframe.contentWindow;
    const frameDoc = iframe.contentDocument;
    const fullscreenWidth = `${win.innerWidth}px`;

    if (!frameDoc.firstChild) {
      return false;
    }

    const getDimensions = () => {
      const el = frameDoc.querySelector('#Embed').firstChild;
      const width  = Math.max(el.clientWidth, el.offsetWidth);
      const height = Math.max(el.clientHeight, el.offsetHeight);
      const fullscreen = this.props.params.isMobile && this.props.params.fullscreenable;
      // FIXME shouldn't set background & zIndex in a dimensions object
      const fullscreenStyle = {
        width: fullscreenWidth,
        height: '100%',
        left: 0,
        background:'#FFF',
        zIndex: zIndex
      };
      const popoverStyle = {
        width: (_.isFinite(width) ? width : 0) + this.props.params.offsetWidth,
        height: (_.isFinite(height) ? height : 0) + this.props.params.offsetHeight
      };

      // Set a full width frame with a dynamic height
      if (this.props.params.fullWidth) {
        return {
          width: '100%',
          height: (_.isFinite(height) ? height : 0) + this.props.params.offsetHeight
        };
      }

      return fullscreen
            ? fullscreenStyle
            : popoverStyle;
    };

    if (this.props.params.fullscreenable && this.props.params.isMobile) {
      frameDoc.body.firstChild.setAttribute(
        'style',
        [`width: ${fullscreenWidth}`,
        'height: 100%',
        'overflow-x: hidden'].join(';')
      );
    }

    const dimensions = getDimensions();

      const getDimensions = () => {
        const el = frameDoc.querySelector('#Embed').firstChild;
        const width  = Math.max(el.clientWidth, el.offsetWidth);
        const height = Math.max(el.clientHeight, el.offsetHeight);
        const fullscreen = params.isMobile && params.fullscreenable;
        // FIXME shouldn't set background & zIndex in a dimensions object
        const fullscreenStyle = {
          width: '100%',
          maxWidth: fullscreenWidth,
          height: '100%',
          // Ensure the embed iframe is off the screen when not visible.
          left: this.state.visible ? '0px' : '-9999px',
          background:'#FFF',
          zIndex: zIndex
        };
        const popoverStyle = {
          width: (_.isFinite(width) ? width : 0) + params.offsetWidth,
          height: (_.isFinite(height) ? height : 0) + params.offsetHeight
        };

      if (params.fullscreenable && params.isMobile) {
        frameDoc.body.firstChild.setAttribute(
          'style',
          ['width: 100%',
          `max-width: ${fullscreenWidth}`,
          'height: 100%',
          'overflow-x: hidden'].join(';')
        );
      }
    frameWin.setTimeout(() => this.setState({ iframeDimensions: dimensions }), 0);
    return dimensions;
  }

  updateBaseFontSize = (fontSize) => {
    const iframe = ReactDOM.findDOMNode(this);
    const htmlElem = iframe.contentDocument.documentElement;

    htmlElem.style.fontSize = fontSize;
  }

  show = (options = {}) => {
    const frameFirstChild = ReactDOM.findDOMNode(this).contentDocument.body.firstChild.firstChild;
    const transition = this.props.params.transitions[options.transition] || defaultShowTransition;
    const animateFrom = _.extend({}, this.state.frameStyle, transition.start);
    const animateTo = _.extend({}, this.state.frameStyle, transition.end);

    this.setState({ visible: true, frameStyle: animateFrom });

    if (expanded && this.props.params.expandable) {
      this.getRootComponent().expand(true);
    } else if (this.props.params.expandable) {
      this.getRootComponent().expand(false);
    }

    this.getRootComponent().setState({ x: ''});

    setTimeout( () => {
      const existingStyle = frameFirstChild.style;

      if (!existingStyle.webkitOverflowScrolling) {
        existingStyle.webkitOverflowScrolling = 'touch';
      }
    }, 50);

    setTimeout(
      () => this.props.params.afterShowAnimate(this),
      cssTimeToMs(transition.end.transitionDuration)
    );

    this.props.params.onShow(this);
  }

  hide = (options = {}) => {
    const transition = this.props.params.transitions[options.transition] || defaultHideTransition;
    const frameStyle = _.extend({}, this.state.frameStyle, transition.end);

    this.setState({ frameStyle });

    setTimeout(() => {
      this.setState({ visible: false });
      if (this.props.params.onHide) {
        this.props.params.onHide(this);
      }
    }, cssTimeToMs(transition.end.transitionDuration));
  }

  close = (ev, options = {}) => {
    if (this.props.params.preventClose) return;

    // ev.touches added for automation testing mobile browsers
    // which is firing 'click' event on iframe close
    if (this.props.params.isMobile && ev.touches) {
      clickBusterRegister(ev.touches[0].clientX, ev.touches[0].clientY);
    }

    const transition = isPositionTop
                      ? 'upHide'
                      : 'downHide';

    this.hide({ transition });

    this.props.params.onClose(this, options);
  }

  back = (ev) => {
    ev.preventDefault();
    this.props.params.onBack(this);
  }

  expand = (e) => {
    e.preventDefault();

    expanded = !expanded;
    this.getRootComponent().expand(expanded);
  }

  setHiddenByZoom = (hide) => {
    this.setState({
      hiddenByZoom: hide
    });
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible });
  }

  setHighlightColor = (color) => {
    this.getChild().setHighlightColor(color);
  }

  setButtonColor = (color) => {
    this.getChild().setButtonColor(color);
  }

  computeIframeStyle = () => {
    const iframeDimensions = this.state.iframeDimensions;
    const visibilityRule = (this.state.visible && !this.state.hiddenByZoom)
                          ? null
                          : transitionFactory.hiddenState(
                            iframeDimensions.height,
                            isPositionTop
                          );

    const offset = settings.get('offset');
    const horizontalOffset = (isMobileBrowser() || !offset) ? 0 : offset.horizontal;
    const verticalOffset = (isMobileBrowser() || !offset) ? 0 : offset.vertical;
    const horizontalPos = settings.get('position.horizontal') || this.props.params.position;
    const verticalPos = isPositionTop ? 'top' : 'bottom';
    const posObj = {
      [horizontalPos]: horizontalOffset,
      [verticalPos]: verticalOffset
    };

    return _.extend(
      {
        border: 'none',
        background: 'transparent',
        zIndex: zIndex,
        transform: 'translateZ(0)',
        position: 'fixed',
        opacity: 1
      },
      posObj,
      this.state.frameStyle,
      iframeDimensions,
      visibilityRule
    );
  }

  constructEmbed = (html, doc) => {
    const position = settings.get('position.horizontal') || this.props.position;
    const cssText = baseCSS + mainCSS + this.props.params.css + baseFontCSS;
    const fullscreen = this.props.params.fullscreenable && this.props.params.isMobile;
    const positionClasses = classNames({
      'u-borderTransparent u-posRelative': !fullscreen,
      'u-pullRight': position === 'right',
      'u-pullLeft': position === 'left',
      'u-noPrint': !fullscreen
    });

    // 1. Loop over functions in this.props.params.extend
    // 2. Re-bind them to `this` context
    // 3. Store in childParams
    let newParams = _.reduce(
      this.props.params.extend,
      (res, val, key) => {
        res[key] = val;
        return res;
      },
      {}
    );

    // Callbacks to be passed down to child component
    newParams = _.extend(newParams, {
      updateFrameSize: this.updateFrameSize,
      setFrameSize: this.setFrameSize,
      setOffsetHorizontal: this.setOffsetHorizontal
    });

    const element = doc.body.appendChild(doc.createElement('div'));

    element.className = positionClasses;

    const newChild = React.cloneElement(this.props.children, newParams);

    this.child = ReactDOM.render(
      <EmbedWrapper
        baseCSS={cssText}
        reduxStore={this.props.store}
        handleBackClick={this.back}
        handleCloseClick={this.close}
        handleExpandClick={this.expand}
        updateFrameSize={this.updateFrameSize}
        showExpandButton={this.props.params.expandable && !expandedSetting}
        hideCloseButton={this.props.params.hideCloseButton}
        name={this.props.params.name}
        fullscreen={fullscreen}>
        {newChild}
      </EmbedWrapper>,
      element
    );

    this.setState({ _rendered: true });
  }

  renderFrameContent = () => {
    if (this.state._rendered) {
      return false;
    }

    const iframe = ReactDOM.findDOMNode(this);
    const html = iframe.contentDocument.documentElement;
    const doc = iframe.contentWindow.document;

    if (i18n.isRTL()) {
      html.setAttribute('lang', i18n.getLocale());
      html.setAttribute('dir', 'rtl');
    }

    // In order for iframe to correctly render in some browsers
    // we need to do it on nextTick
    if (doc.readyState === 'complete') {
      this.constructEmbed(html, doc);
    } else {
      setTimeout(this.renderFrameContent, 0);
    }
  }

  render = () => {
    const iframeNamespace = 'zEWidget';
    const iframeClasses = classNames({
      [`${iframeNamespace}-${this.props.params.name}`]: true,
      [`${iframeNamespace}-${this.props.params.name}--active`]: this.state.visible
    });

    return (
      <iframe style={this.computeIframeStyle()} id={this.props.params.name} className={iframeClasses} />
    );
  }
}

Frame.propTypes = {
  fullscreen: PropTypes.bool,
  visible: PropTypes.bool,
  position: PropTypes.string,
  params: PropTypes.object
};

Frame.defaultProps = {
  fullscreen: false,
  visible: true,
  position: 'right',
  params: {
    frameStyle: {
      marginTop: isSettingsTop && !isMobile ? '15px' : 0
    },
    css: '',
    fullscreenable: false,
    onShow: () => {},
    onHide: () => {},
    onClose: () => {},
    onBack: () => {},
    afterShowAnimate: () => {},
    transitions: {},
    isMobile,
    disableSetOffsetHorizontal: false,
    offsetWidth: 15,
    offsetHeight: 15,
    position: 'right',
    preventClose: false
  }
};
