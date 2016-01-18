import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { win }                 from 'utility/globals';
import { isMobileBrowser,
         isFirefox }           from 'utility/devices';
import { clickBusterRegister,
         generateNpsCSS }      from 'utility/utils';
import { i18n }                from 'service/i18n';
import { ButtonNav }           from 'component/Button';
import { Icon }                from 'component/Icon';
import snabbt                  from 'snabbt.js';

const baseCSS = require('baseCSS');
const mainCSS = require('mainCSS');

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

export const frameFactory = function(childFn, _params) {
  /* eslint-disable */
  let child;

  const defaultParams = {
    frameStyle: {},
    css: '',
    fullscreenable: false,
    onShow: () => {},
    onHide: () => {},
    onClose: () => {},
    onBack: () => {},
    afterShowAnimate: () => {},
    transitions: {},
    isMobile: isMobileBrowser()
  };
  const params = _.extend({}, defaultParams, _params);

  if (__DEV__) {
    validateChildFn(childFn, params);
  }

  return {
    propTypes: {
      fullscreen: React.PropTypes.bool,
      visible: React.PropTypes.bool,
      position: React.PropTypes.string,
      close: React.PropTypes.func,
      back: React.PropTypes.func
    },

    getDefaultProps() {
      return {
        fullscreen: false,
        visible: true,
        position: 'right',
        close: () => {},
        back:() => {}
      };
    },

    getInitialState() {
      return {
        visible: this.props.visible,
        frameStyle: params.frameStyle,
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
      ReactDOM.findDOMNode(this).style.marginLeft = `${offsetValue}px`;
    },

    setFrameSize(width, height, transparent = true) {
      const iframe = ReactDOM.findDOMNode(this);
      const frameWin = iframe.contentWindow;
      const frameDoc = iframe.contentDocument;
      // FIXME shouldn't set background & zIndex in a dimensions object
      const dimensions = {
        height: height,
        width: width,
        zIndex: '999999',
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
    },

    updateFrameSize(offsetWidth = 0, offsetHeight = 0) {
      const iframe = ReactDOM.findDOMNode(this);
      const frameWin = iframe.contentWindow;
      const frameDoc = iframe.contentDocument;

      if (!frameDoc.firstChild) {
        return false;
      }

      const dimensions = function() {
        const el = frameDoc.body.firstChild;
        const width  = Math.max(el.clientWidth,  el.offsetWidth);
        const height = Math.max(el.clientHeight, el.offsetHeight);
        const fullscreen = params.isMobile && params.fullscreenable;
        // FIXME shouldn't set background & zIndex in a dimensions object
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

      if (params.fullscreenable && params.isMobile) {
        frameDoc.body.firstChild.setAttribute(
          'style',
          ['width: 100%',
          'height: 100%',
          'overflow-x: hidden'].join(';')
        );
      }

      frameWin.setTimeout( () => this.setState({iframeDimensions: dimensions()}), 0);
    },

    updateBaseFontSize(fontSize) {
      const iframe = ReactDOM.findDOMNode(this);
      const htmlElem = iframe.contentDocument.documentElement;

      htmlElem.style.fontSize = fontSize;
    },

    show(options = {}) {
      let frameFirstChild = ReactDOM.findDOMNode(this).contentDocument.body.firstChild.firstChild;

      this.setState({ visible: true });

      setTimeout( () => {
        const existingStyle = frameFirstChild.style;

        if (!existingStyle.webkitOverflowScrolling) {
          existingStyle.webkitOverflowScrolling = 'touch';
        }
      }, 50);

      if (params.transitions[options.transition] && !isFirefox()) {
        const transition = params.transitions[options.transition];

        snabbt(ReactDOM.findDOMNode(this), transition).then({
          callback: () => {
            params.afterShowAnimate(this);
          }
        });
      }

      params.onShow(this);
    },

    hide(options = {}) {

      if (params.transitions[options.transition] && !isFirefox()) {
        const transition = params.transitions[options.transition];

        snabbt(ReactDOM.findDOMNode(this), transition).then({
          callback: () => {
            this.setState({ visible: false });
            params.onHide(this);

            // Ugly, I know, but it's to undo snabbt's destructive style mutations
            _.each(this.computeIframeStyle(), (val, key) => {
              ReactDOM.findDOMNode(this).style[key] = val;
            });
          }
        });
      } else {
        this.setState({ visible: false });
        params.onHide(this);
      }
    },

    close(ev) {
      // ev.touches added for automation testing mobile browsers
      // which is firing 'click' event on iframe close
      if (params.isMobile && ev.touches) {
        clickBusterRegister(ev.touches[0].clientX, ev.touches[0].clientY);
      }

      if (params.isMobile) {
        this.hide();
      } else {
        this.hide({ transition: 'close' });
      }

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

    computeIframeStyle: function() {
      const visibilityRule = (this.state.visible && !this.state.hiddenByZoom)
                           ? null
                           : {top: '-9999px',
                              [i18n.isRTL() ? 'right' : 'left']: '-9999px',
                              position: 'absolute',
                              bottom: 'auto'};

      return _.extend(
        {
          border: 'none',
          background: 'transparent',
          zIndex: 999998,
          transform: 'translateZ(0)',
          opacity: 1
        },
        this.state.frameStyle,
        this.state.iframeDimensions,
        visibilityRule
      );
    },

    render: function() {
      const iframeNamespace = 'zEWidget';

      const iframeClasses = classNames({
        [`${iframeNamespace}-${params.name}`]: true,
        [`${iframeNamespace}-${params.name}--active`]: this.state.visible
      });

      return (
        <iframe style={this.computeIframeStyle()} id={params.name} className={iframeClasses} />
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

      const iframe = ReactDOM.findDOMNode(this);
      const html = iframe.contentDocument.documentElement;
      const doc = iframe.contentWindow.document;

      // In order for iframe correctly render in some browsers
      // we need to do it on nextTick
      if (doc.readyState === 'complete') {
        if (i18n.isRTL()) {
          html.setAttribute('dir', 'rtl');
          html.setAttribute('lang', i18n.getLocale());
        }

        const cssText = baseCSS + mainCSS + params.css;
        const css = <style dangerouslySetInnerHTML={{ __html: cssText }} />;
        const fullscreen = params.fullscreenable && params.isMobile;
        const positionClasses = classNames({
          'u-borderTransparent u-posRelative': !fullscreen,
          'u-pullRight': this.props.position === 'right',
          'u-pullLeft': this.props.position === 'left'
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
              showBackButton: false,
              isMobile: false
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

          renderCloseButton() {
            return (
              <ButtonNav
                onClick={this.props.close}
                label={
                  <Icon
                    type='Icon--close'
                    className='u-textInheritColor'
                    isMobile={this.state.isMobile} />
                }
                rtl={i18n.isRTL()}
                position='right'
                fullscreen={this.props.fullscreen || this.state.isMobile} />
            );
          },

          renderBackButton() {
            return (
              <ButtonNav
                onClick={this.props.back}
                label={
                  <Icon
                    type='Icon--back'
                    className='u-textInheritColor'
                    isMobile={this.state.isMobile} />
                }
                rtl={i18n.isRTL()}
                position='left'
                fullscreen={this.props.fullscreen || this.state.isMobile} />
            );
          },

          render() {
            const backButtonClasses = classNames({
              'u-isHidden': !this.state.showBackButton
            });
            const closeButtonClasses = classNames({
              'closeButton': true,
              'u-isHidden': params.hideCloseButton
            });
            const styleTag = <style dangerouslySetInnerHTML={{ __html: this.state.css }} />;

            return (
              <div>
                {css}
                {styleTag}
                {childFn(childParams)}
                <div className={backButtonClasses}>
                  {this.renderBackButton()}
                </div>
                <div className={closeButtonClasses}>
                  {this.renderCloseButton()}
                </div>
              </div>
            );
          }
        });

        const element = doc.body.appendChild(doc.createElement('div'));
        element.className = positionClasses;

        /* eslint-enable */
        child = ReactDOM.render(
          <Component
            back={this.back}
            close={this.close}
            fullscreen={fullscreen} />,
          element
        );

        this.setState({_rendered: true});
      } else {
        setTimeout(this.renderFrameContent, 0);
      }
    },

    componentWillUnmount() {
      React.unmountComponentAtNode(ReactDOM.findDOMNode(this).contentDocument.body);
    }
  };
};
