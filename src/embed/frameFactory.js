import React from 'react/addons';
import _     from 'lodash';

import { win }                 from 'utility/globals';
import { getSizingRatio,
         isMobileBrowser }     from 'utility/devices';
import { clickBusterRegister,
         generateNpsCSS }      from 'utility/utils';
import { i18n }                from 'service/i18n';
import { snabbt }              from 'snabbt.js';
import { ButtonNav }           from 'component/Button';
import { Icon }                from 'component/Icon';

const classSet = React.addons.classSet;
const baseCSS = require('baseCSS');
const mainCSS = require('mainCSS');
const sizingRatio = 12 * getSizingRatio(false, true); /* jshint ignore:line */
const baseFontCSS = `html { font-size: ${sizingRatio}px }`;

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

export var frameFactory = function(childFn, _params) {
  let child;

  const defaultParams = {
    frameStyle: {},
    css: '',
    fullscreenable: false,
    onShow: () => {},
    onHide: () => {},
    onClose: () => {},
    onBack: () => {},
    afterShowAnimate: () => {}
  };
  const params = _.extend({}, defaultParams, _params);

  if (__DEV__) {
    validateChildFn(childFn, params);
  }

  return {
    getDefaultProps() {
      return {
        visible: true,
        position: 'right'
      };
    },

    getInitialState() {
      return {
        visible: this.props.visible,
        hiddenByZoom: false,
        _rendered: false,
        iframeDimensions: {
          height: 0,
          width: 0
        }
      };
    },

    getChild() {
      return child;
    },

    getRootComponent() {
      if (child) {
        return child.refs.rootComponent;
      }
    },

    setOffsetHorizontal(offsetValue = 0) {
      // No percentage offset support for now
      if (isNaN(offsetValue)) { return; }

      const iframe = this.getDOMNode();
      const horizontalPos = iframe.style.left;
      let adjustedValue = 0;

      if (!horizontalPos) {
        iframe.style.left = `${offsetValue / win.innerWidth * 100}%`;
        iframe.style.right = ''; // Remove style from attr
        return;
      }

      const isPercentage = horizontalPos.indexOf('%') >= 0;

      if (isPercentage) {
        const percentage = horizontalPos.replace('%', '') / 100;
        const widthPosValue = win.innerWidth * percentage;
        adjustedValue = `${(widthPosValue + offsetValue) / win.innerWidth * 100}%`;
      } else {
        const widthPosValue = horizontalPos.replace('px', '');
        adjustedValue = `${widthPosValue + offsetValue}px`;
      }

      iframe.style.left = adjustedValue;
      iframe.style.right = ''; // Remove style from attr
    },

    setFrameSize(width, height, transparent = true) {
      const iframe = this.getDOMNode();
      const frameWin = iframe.contentWindow;
      const frameDoc = iframe.contentDocument;
      //FIXME shouldn't set background & zIndex in a dimensions object
      const dimensions = {
        height: height,
        width: width,
        zIndex: '999999',
        //FIXME addresses combination of dropshadow & margin & white background on iframe
        background: transparent ? 'linear-gradient(transparent, #FFFFFF)' : '#fff'
      };

      if (params.fullscreenable && isMobileBrowser()) {
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
    },

    updateFrameSize(offsetWidth = 0, offsetHeight = 0) {
      const iframe = this.getDOMNode();
      const frameWin = iframe.contentWindow;
      const frameDoc = iframe.contentDocument;

      if (!frameDoc.firstChild) {
        return false;
      }

      const dimensions = function() {
        /* jshint laxbreak: true */
        const el = frameDoc.body.firstChild;
        const width  = Math.max(el.clientWidth,  el.offsetWidth);
        const height = Math.max(el.clientHeight, el.offsetHeight);
        const fullscreen = isMobileBrowser() && params.fullscreenable;
        //FIXME shouldn't set background & zIndex in a dimensions object
        const fullscreenStyle = {
          width: `${win.innerWidth}px`,
          height: '100%',
          top:0,
          left:0,
          background:'#fff',
          zIndex: 999999
        };
        const popoverStyle = {
          width:  (_.isFinite(width)  ? width  : 0) + offsetWidth,
          height: (_.isFinite(height) ? height : 0) + offsetHeight
        };

        return fullscreen
             ? fullscreenStyle
             : popoverStyle;
      };

      if (params.fullscreenable && isMobileBrowser()) {
        frameDoc.body.firstChild.setAttribute(
          'style',
          ['width: 100%',
          'height: 100%',
          'overflow-x: hidden'].join(';')
        );
      }

      frameWin.setTimeout( () => this.setState({iframeDimensions: dimensions()}), 0);
    },

    show() {
      let frameFirstChild = this.getDOMNode().contentDocument.body.firstChild;

      this.setState({
        visible: true
      });

      setTimeout( () => {
        const existingStyle = frameFirstChild.style;

        if (!existingStyle.webkitOverflowScrolling) {
          existingStyle.webkitOverflowScrolling = 'touch';
        }
      }, 50);

      if (params.transitionIn) {
        const transitionIn = _.clone(params.transitionIn);
        const oldCb = transitionIn.callback;
        transitionIn.callback = () => {
          if (params.afterShowAnimate) {
            params.afterShowAnimate(this);
          }
          if (oldCb) {
            oldCb(this);
          }
        };

        snabbt(this.getDOMNode(), transitionIn);
      }

      params.onShow(this);
    },

    hide() {

      if (params.transitionOut) {
        const transitionOut = _.clone(params.transitionOut);

        const oldCb = transitionOut.callback;

        transitionOut.callback = () => {
          this.setState({ visible: false });
          if (oldCb) {
            oldCb(this);
          }
        };

        snabbt(this.getDOMNode(), transitionOut);

      } else {
        params.onHide(this);
        this.setState({
          visible: false
        });
      }
    },

    close(ev) {
      // ev.touches added for  automation testing mobile browsers
      // which is firing 'click' event on iframe close
      if (isMobileBrowser() && ev.touches) {
        clickBusterRegister(ev.touches[0].clientX, ev.touches[0].clientY);
      }
      this.hide();
      params.onClose(this);
    },

    back(ev) {
      ev.preventDefault();
      params.onBack(this);
    },

    setHiddenByZoom(hide) {
      this.setState({
        hiddenByZoom: hide
      });
    },

    toggleVisibility() {
      this.setState({ visible: !this.state.visible });
    },

    setHighlightColor: function(color) {
      this.getChild().setHighlightColor(color);
    },

    render: function() {
      /* jshint laxbreak: true */
      const iframeNamespace = 'zEWidget';
      const visibilityRule = (this.state.visible && !this.state.hiddenByZoom)
                           ? null
                           : {top: '-9999px',
                             [i18n.isRTL() ? 'right' : 'left']: '-9999px',
                             bottom: 'auto'};
      const iframeStyle = _.extend(
        {
          border: 'none',
          background: 'transparent',
          zIndex: 999998,
          transform: 'translateZ(0)'
        },
        params.frameStyle,
        this.state.iframeDimensions,
        visibilityRule
      );

      const iframeClasses = classSet({
        [`${iframeNamespace}-${params.name}`]: true,
        [`${iframeNamespace}-${params.name}--active`]: this.state.visible
      });

      return (
        <iframe style={iframeStyle} id={params.name} className={iframeClasses} />
      );
    },

    componentDidMount() {
      this.renderFrameContent();
    },

    componentDidUpdate() {
      this.renderFrameContent();
    },

    renderFrameContent() {
      if (this.state._rendered) {
        return false;
      }

      const iframe = this.getDOMNode();
      const html = iframe.contentDocument.documentElement;
      const doc = iframe.contentWindow.document;

      // In order for iframe correctly render in some browsers
      // we need to do it on nextTick
      if (doc.readyState === 'complete') {
        if (i18n.isRTL()) {
          html.setAttribute('dir', 'rtl');
          html.setAttribute('lang', i18n.getLocale());
        }

        /* jshint laxbreak: true */
        const cssText = baseCSS + mainCSS + params.css + baseFontCSS;
        const css = <style dangerouslySetInnerHTML={{ __html: cssText }} />;
        const fullscreen = isMobileBrowser() && params.fullscreenable;
        const positionClasses = classSet({
          'u-borderTransparent u-posRelative': !fullscreen,
          'u-pullRight': this.props.position === 'right',
          'u-pullLeft': this.props.position === 'left'
        });
        const closeButton = (<ButtonNav
                               onClick={this.close}
                               label={
                                 <Icon
                                   type='Icon--close'
                                   className='u-textInheritColor' />
                               }
                               rtl={i18n.isRTL()}
                               position='right'
                               fullscreen={fullscreen} />);
        const backButton = (<ButtonNav
                              onClick={this.back}
                              label={
                                <Icon
                                  type='Icon--back'
                                  className='u-textInheritColor' />
                              }
                              rtl={i18n.isRTL()}
                              position='left'
                              fullscreen={fullscreen} />);

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

        // Forcefully injects this.updateFrameSize
        // into childParams
        childParams = _.extend(childParams, {
          updateFrameSize: this.updateFrameSize,
          setFrameSize: this.setFrameSize,
          setOffsetHorizontal: this.setOffsetHorizontal
        });

        const Component = React.createClass({
          getInitialState() {
            return {
              css: '',
              showBackButton: false
            };
          },

          setHighlightColor(color) {
            const cssClasses = generateNpsCSS({ color: color });

            if (cssClasses) {
              this.setState({
                css: cssClasses
              });
            }
          },

          render() {
            const backButtonClasses = classSet({
              'u-isHidden': !this.state.showBackButton
            });
            const closeButtonClasses = classSet({
              'u-isHidden': params.hideCloseButton
            });
            const styleTag = <style dangerouslySetInnerHTML={{ __html: this.state.css }} />;

            return (
              <div className={positionClasses}>
                {css}
                {styleTag}
                {childFn(childParams)}
                <div className={backButtonClasses}>
                  {backButton}
                </div>
                <div className={closeButtonClasses}>
                  {closeButton}
                </div>
              </div>
            );
          }
        });

        child = React.render(<Component />, doc.body);

        this.setState({_rendered: true});

      } else {
        setTimeout(this.renderFrameContent, 0);
      }
    },

    componentWillUnmount() {
      React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
    }

  };
};
