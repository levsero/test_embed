import React from 'react/addons';
import _     from 'lodash';

import { win }                 from 'utility/globals';
import { getSizingRatio,
         isMobileBrowser }     from 'utility/devices';
import { clickBusterRegister } from 'utility/utils';
import { i18n }                from 'service/i18n';
import { snabbt }              from 'snabbt.js';
import { ButtonNav }           from 'component/Button';
import { Icon }                from 'component/Icon';

var classSet = React.addons.classSet,
    baseCSS = require('baseCSS'),
    mainCSS = require('mainCSS'),
    sizingRatio = 12 * getSizingRatio(false, true), /* jshint ignore:line */
    baseFontCSS = `html { font-size: ${sizingRatio}px }`;

function validateChildFn(childFn, params) {
  if (!_.isFunction(childFn)) {
    throw 'childFn should be a function';
  }

  var component = childFn(params.extend);

  if (!React.isValidElement(component)) {
    var e = new TypeError();
    e.message = 'childFn should be a function that returns a React component';
    throw e;
  }
}

export var frameFactory = function(childFn, _params) {
  var child,
      defaultParams = {
        style: {},
        css: '',
        fullscreenable: false
      },
      params = _.extend(defaultParams, _params),
      afterShowAnimate = () => {
        if (params.afterShowAnimate) {
          params.afterShowAnimate(child);
        }
      },
      // object passed into snabbt animation lib
      springTransition = {
        /* jshint camelcase: false */
        from_position: [0, 15, 0],
        position: [0, 0, 0],
        easing: 'spring',
        spring_constant: 0.5,
        spring_deacceleration: 0.75,
        callback: afterShowAnimate
      };


  validateChildFn(childFn, params);

  return {
    getDefaultProps: function() {
      return {
        visible: true,
        position: 'right'
      };
    },

    getInitialState: function() {
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

    getChild: function() {
      return child;
    },

    updateFrameSize: function(offsetWidth = 0, offsetHeight = 0) {
      var iframe = this.getDOMNode(),
          frameWin = iframe.contentWindow,
          frameDoc = iframe.contentDocument,
          dimensions;

      if (!frameDoc.firstChild) {
        return false;
      }

      dimensions = function() {
        /* jshint laxbreak: true */
        var el = frameDoc.body.firstChild,
            width  = Math.max(el.clientWidth,  el.offsetWidth),
            height = Math.max(el.clientHeight, el.offsetHeight),
            fullscreen = isMobileBrowser() && params.fullscreenable,
            fullscreenStyle = {
              width: `${win.innerWidth}px`,
              height: '100%',
              top:0,
              left:0,
              background:'#fff',
              zIndex: 999999
            },
            popoverStyle = {
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

    show: function(animate) {
      var frameFirstChild = this.getDOMNode().contentDocument.body.firstChild;

      this.setState({
        visible: true
      });

      setTimeout( () => {
        var existingStyle = frameFirstChild.style;

        if (!existingStyle.webkitOverflowScrolling) {
          existingStyle.webkitOverflowScrolling = 'touch';
        }
      }, 50);

      if (!isMobileBrowser() && animate) {
        snabbt(this.getDOMNode(), springTransition);
      }

      if (params.onShow) {
        params.onShow(child);
      }
    },

    updateBaseFontSize(fontSize) {
      var iframe = this.getDOMNode(),
          htmlElem = iframe.contentDocument.documentElement;

      htmlElem.style.fontSize = fontSize;
    },

    hide: function() {
      this.setState({
        visible: false
      });

      if (params.onHide) {
        params.onHide(child);
      }
    },

    close: function(ev) {
      if (isMobileBrowser()) {
        clickBusterRegister(ev.touches[0].clientX, ev.touches[0].clientY);
      }
      this.hide();
      if (params.onClose) {
        params.onClose(child);
      }
    },

    back: function(ev) {
      ev.preventDefault();
      if (params.onBack) {
        params.onBack(child);
      }
    },

    setHiddenByZoom: function(hide) {
      this.setState({
        hiddenByZoom: hide
      });
    },

    toggleVisibility: function() {
      this.setState({
        visible: !this.state.visible
      });
    },

    render: function() {
      /* jshint laxbreak: true */
      var visibilityRule = (this.state.visible && !this.state.hiddenByZoom)
                         ? null
                         : {left: '-9999px'},
          iframeStyle = _.extend({
              border: 'none',
              background: 'transparent',
              zIndex: 999998,
              transform: 'translateZ(0)'
            },
            params.style,
            this.state.iframeDimensions,
            visibilityRule
          );

          return (
            <iframe style={iframeStyle} id={params.name} />
          );
    },


    componentDidMount: function() {
      this.renderFrameContent();
    },

    componentDidUpdate: function() {
      this.renderFrameContent();
    },

    renderFrameContent: function() {
      if (this.state._rendered) {
        return false;
      }

      var iframe = this.getDOMNode(),
          html = iframe.contentDocument.documentElement,
          doc = iframe.contentWindow.document;

      // In order for iframe correctly render in some browsers
      // we need to do it on nextTick
      if (doc.readyState === 'complete') {
        if (i18n.isRTL()) {
          html.setAttribute('dir', 'rtl');
          html.setAttribute('lang', i18n.getLocale());
        }

        /* jshint laxbreak: true */
        var cssText = baseCSS + mainCSS + params.css + baseFontCSS,
            css = <style dangerouslySetInnerHTML={{ __html: cssText }} />,
            Component,
            childParams,
            fullscreen = isMobileBrowser() && params.fullscreenable,
            positionClasses = classSet({
              'u-borderTransparent u-posRelative': true,
              'u-pullRight': this.props.position === 'right',
              'u-pullLeft': this.props.position === 'left'
            }),
            closeButton = (<ButtonNav
                            onClick={this.close}
                            label={
                              <Icon
                                type='Icon--close'
                                className='u-textInheritColor' />
                            }
                            rtl={i18n.isRTL()}
                            position='right'
                            fullscreen={fullscreen} />),
            backButton = (<ButtonNav
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
        childParams = _.reduce(
          params.extend,
          (res, val, key) => {
            res[key] = val.bind(this);
            return res;
          },
          {});

        // Forcefully injects this.updateFrameSize
        // into childParams
        childParams = _.extend(childParams, {
          updateFrameSize: this.updateFrameSize
        });

        Component = React.createClass({
          getInitialState() {
            return {
              showBackButton: false
            };
          },

          render() {
            var backButtonClasses = classSet({
                  'u-isHidden': !this.state.showBackButton
                }),
                closeButtonClasses = classSet({
                  'u-isHidden': params.hideCloseButton
                });

            return (
              <div className={positionClasses}>
                {css}
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

    componentWillUnmount: function() {
      React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
    }

  };
};
