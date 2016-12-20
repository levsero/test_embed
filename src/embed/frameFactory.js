import React, { Component, PropTypes } from 'react';
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
import { bindMethods,
         cssTimeToMs } from 'utility/utils';

// Unregister lodash from window._
if (!__DEV__) {
  _.noConflict();
}

const baseCSS = require('baseCSS');
const mainCSS = require('mainCSS');
const sizingRatio = 12 * getZoomSizingRatio(false, true);
const baseFontCSS = `html { font-size: ${sizingRatio}px }`;
const expandedSetting = settings.get('expanded');

let expanded = expandedSetting;

function validateChildFn(childFn, params) {
  if (!_.isFunction(childFn)) {
    throw 'childFn should be a function';
  }

  let component = childFn(params.extend || {});

  if (!React.isValidElement(component)) {
    const e = new TypeError();

    e.message = 'childFn should be a function that returns a React component';
    throw e;
  }

  if (component.ref !== 'rootComponent') {
    const e = new TypeError();

    e.message = 'childFn should return component with ref="rootComponent"';
    throw e;
  }
}

export const frameFactory = function(childFn, _params, reduxStore) {
  let child;

  const isSettingsTop = settings.get('position.vertical') === 'top';
  const isMobile = isMobileBrowser();
  const defaultParams = {
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
  };
  const params = _.defaultsDeep({}, _params, defaultParams);
  const isPositionTop = isSettingsTop || params.name === 'ipm';
  const zIndex = settings.get('zIndex');
  const defaultHideTransition = isPositionTop
                              ? transitionFactory.webWidget.upHide()
                              : transitionFactory.webWidget.downHide();
  const defaultShowTransition = isPositionTop
                              ? transitionFactory.webWidget.downShow()
                              : transitionFactory.webWidget.upShow();

  if (__DEV__) {
    validateChildFn(childFn, params);
  }

  class Frame extends Component {
    constructor(props, context) {
      super(props, context);
      bindMethods(this, Frame.prototype);

      this.state = {
        visible: this.props.visible,
        frameStyle: params.frameStyle,
        hiddenByZoom: false,
        _rendered: false,
        iframeDimensions: {
          height: 0,
          width: 0
        }
      };
    }

    componentDidMount() {
      this.renderFrameContent();
    }

    componentDidUpdate() {
      this.renderFrameContent();
    }

    componentWillUnmount() {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).contentDocument.body);
    }

    getChild() {
      return child;
    }

    getRootComponent() {
      if (child) {
        const rootComponent = child.refs.rootComponent;

        return rootComponent.getWrappedInstance
             ? rootComponent.getWrappedInstance()
             : rootComponent;
      }
    }

    setOffsetHorizontal(offsetValue = 0) {
      if (!params.disableSetOffsetHorizontal) {
        ReactDOM.findDOMNode(this).style.marginLeft = `${offsetValue}px`;
        ReactDOM.findDOMNode(this).style.marginRight = `${offsetValue}px`;
      }
    }

    setFrameSize(width, height, transparent = true) {
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

      if (params.fullscreenable) {
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

    updateFrameSize() {
      const iframe = ReactDOM.findDOMNode(this);
      const frameWin = iframe.contentWindow;
      const frameDoc = iframe.contentDocument;

      if (!frameDoc.firstChild) {
        return false;
      }

      const getDimensions = function() {
        const el = frameDoc.querySelector('#Embed').firstChild;
        const width  = Math.max(el.clientWidth, el.offsetWidth);
        const height = Math.max(el.clientHeight, el.offsetHeight);
        const fullscreen = params.isMobile && params.fullscreenable;
        // FIXME shouldn't set background & zIndex in a dimensions object
        const fullscreenStyle = {
          width: `${win.innerWidth}px`,
          height: '100%',
          left:0,
          background:'#FFF',
          zIndex: zIndex
        };
        const popoverStyle = {
          width: (_.isFinite(width) ? width : 0) + params.offsetWidth,
          height: (_.isFinite(height) ? height : 0) + params.offsetHeight
        };

        // Set a full width frame with a dynamic height
        if (params.fullWidth) {
          return {
            width: '100%',
            height: (_.isFinite(height) ? height : 0) + params.offsetHeight
          };
        }

        return fullscreen
             ? fullscreenStyle
             : popoverStyle;
      };

      if (params.fullscreenable && params.isMobile) {
        frameDoc.body.firstChild.setAttribute(
          'style',
          ['width: 100%',
          'height: 100%',
          'overflow-x: hidden'].join(';')
        );
      }

      const dimensions = getDimensions();

      if (expanded && params.expandable) {
        dimensions.height = '100%';
      }

      frameWin.setTimeout(() => this.setState({ iframeDimensions: dimensions }), 0);
      return dimensions;
    }

    updateBaseFontSize(fontSize) {
      const iframe = ReactDOM.findDOMNode(this);
      const htmlElem = iframe.contentDocument.documentElement;

      htmlElem.style.fontSize = fontSize;
    }

    show(options = {}) {
      const frameFirstChild = ReactDOM.findDOMNode(this).contentDocument.body.firstChild.firstChild;
      const transition = params.transitions[options.transition] || defaultShowTransition;
      const animateFrom = _.extend({}, this.state.frameStyle, transition.start);
      const animateTo = _.extend({}, this.state.frameStyle, transition.end);

      this.setState({ visible: true, frameStyle: animateFrom });

      if (expanded && params.expandable) {
        this.getRootComponent().expand(true);
      } else if (params.expandable) {
        this.getRootComponent().expand(false);
      }

      setTimeout( () => {
        const existingStyle = frameFirstChild.style;

        if (!existingStyle.webkitOverflowScrolling) {
          existingStyle.webkitOverflowScrolling = 'touch';
        }
      }, 50);

      setTimeout(() => this.setState({ frameStyle: animateTo }), 0);

      setTimeout(
        () => params.afterShowAnimate(this),
        cssTimeToMs(transition.end.transitionDuration)
      );

      params.onShow(this);
    }

    hide(options = {}) {
      const transition = params.transitions[options.transition] || defaultHideTransition;
      const frameStyle = _.extend({}, this.state.frameStyle, transition.end);

      this.setState({ frameStyle });

      setTimeout(() => {
        this.setState({ visible: false });
        params.onHide(this);
      }, cssTimeToMs(transition.end.transitionDuration));
    }

    close(ev, options = {}) {
      if (params.preventClose) return;

      // ev.touches added for automation testing mobile browsers
      // which is firing 'click' event on iframe close
      if (params.isMobile && ev.touches) {
        clickBusterRegister(ev.touches[0].clientX, ev.touches[0].clientY);
      }

      const transition = isPositionTop
                       ? 'upHide'
                       : 'downHide';

      this.hide({ transition });

      params.onClose(this, options);
    }

    back(ev) {
      ev.preventDefault();
      params.onBack(this);
    }

    expand(e) {
      e.preventDefault();

      expanded = !expanded;
      this.getRootComponent().expand(expanded);
    }

    setHiddenByZoom(hide) {
      this.setState({
        hiddenByZoom: hide
      });
    }

    toggleVisibility() {
      this.setState({ visible: !this.state.visible });
    }

    setHighlightColor(color) {
      this.getChild().setHighlightColor(color);
    }

    setButtonColor(color) {
      this.getChild().setButtonColor(color);
    }

    computeIframeStyle() {
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
      const horizontalPos = settings.get('position.horizontal') || params.position;
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

    constructEmbed(html, doc) {
      const position = settings.get('position.horizontal') || this.props.position;
      const cssText = baseCSS + mainCSS + params.css + baseFontCSS;
      const fullscreen = params.fullscreenable && params.isMobile;
      const positionClasses = classNames({
        'u-borderTransparent u-posRelative': !fullscreen,
        'u-pullRight': position === 'right',
        'u-pullLeft': position === 'left',
        'u-noPrint': !fullscreen
      });

      // 1. Loop over functions in params.extend
      // 2. Re-bind them to `this` context
      // 3. Store in childParams
      let childParams = _.reduce(
        params.extend,
        (res, val, key) => {
          res[key] = val.bind(this);
          return res;
        },
        {}
      );

      // Callbacks to be passed down to child component
      childParams = _.extend(childParams, {
        updateFrameSize: this.updateFrameSize,
        setFrameSize: this.setFrameSize,
        setOffsetHorizontal: this.setOffsetHorizontal
      });

      const element = doc.body.appendChild(doc.createElement('div'));

      element.className = positionClasses;

      child = ReactDOM.render(
        <EmbedWrapper
          baseCSS={cssText}
          reduxStore={reduxStore}
          handleBackClick={this.back}
          handleCloseClick={this.close}
          handleExpandClick={this.expand}
          showExpandButton={params.expandable && !expandedSetting}
          hideCloseButton={params.hideCloseButton}
          childFn={childFn}
          childParams={childParams}
          fullscreen={fullscreen} />,
        element
      );

      this.setState({ _rendered: true });
    }

    renderFrameContent() {
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

    render() {
      const iframeNamespace = 'zEWidget';
      const iframeClasses = classNames({
        [`${iframeNamespace}-${params.name}`]: true,
        [`${iframeNamespace}-${params.name}--active`]: this.state.visible
      });

      return (
        <iframe style={this.computeIframeStyle()} id={params.name} className={iframeClasses} />
      );
    }
  }

  Frame.propTypes = {
    fullscreen: PropTypes.bool,
    visible: PropTypes.bool,
    position: PropTypes.string
  };

  Frame.defaultProps = {
    fullscreen: false,
    visible: true,
    position: 'right'
  };

  return Frame;
};
