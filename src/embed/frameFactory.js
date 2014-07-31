/** @jsx React.DOM */
module React from 'react/addons';
import { win } from 'util/globals';
import { getSizingRatio, isMobileBrowser } from 'util/devices';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet,
    baseCSS = require('baseCSS'),
    mainCSS = require('mainCSS'),
    sizingRatio = 12 * getSizingRatio(), /* jshint ignore:line */
    baseFontCSS = `html { font-size: ${sizingRatio}px }`;

function validateChildFn(childFn, params) {
  if (!_.isFunction(childFn)) {
    throw 'childFn should be a function';
  }

  var component = childFn(params.extend);

  if (!React.isValidComponent(component)) {
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
        fullscreenable: false,
      },
      params = _.extend(defaultParams, _params);

  validateChildFn(childFn, params);

  return {
    getDefaultProps: function() {
      return {
        visible: true
      };
    },

    getInitialState: function() {
      return {
        visible: this.props.visible,
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

    updateFrameSize: function(offsetWidth, offsetHeight) {
      var iframe = this.getDOMNode(),
          frameWin = iframe.contentWindow,
          frameDoc = iframe.contentDocument,
          dimensions;

      offsetWidth = offsetWidth || 0;
      offsetHeight = offsetHeight || 0;

      if (!frameDoc.firstChild) {
        return false;
      }

      dimensions = function() {
        /* jshint laxbreak: true */
        var el = frameDoc.body.firstChild,
            width  = Math.max(el.clientWidth,  el.offsetWidth),
            height = Math.max(el.clientHeight, el.offsetHeight);

        return ((getSizingRatio() > 1 || isMobileBrowser()) && params.fullscreenable)
             ? { width: '100%',
                 height: '100%',
                 top:0,
                 left:0,
                 background:'#fff',
                 zIndex: 5 }
             : { width:  (_.isFinite(width)  ? width  : 0) + offsetWidth,
                 height: (_.isFinite(height) ? height : 0) + offsetHeight };
      };

      if (params.fullscreenable && isMobileBrowser()) {
        frameDoc.body.firstChild.setAttribute(
          'style',
          'height:100%; overflow:scroll; -webkit-overflow-scrolling: touch'
        );
      }

      frameWin.setTimeout( () => this.setState({iframeDimensions: dimensions()}), 0);
    },

    show: function() {
      this.setState({
        visible: true
      });

      if (isMobileBrowser()) {
        win.scrollBy(0, 0);
      }
      if (params.onShow) {
        params.onShow();
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
        params.onHide();
      }
    },

    render: function() {
      /* jshint laxbreak: true */
      var visibilityRule = (this.state.visible)
                         ? {visibility: 'visible'}
                         : {visibility: 'hidden', top: '-9999px'},
          iframeStyle = _.extend(
            { border: 'none', background: 'transparent' },
            params.style,
            this.state.iframeDimensions,
            visibilityRule
          );

          return (
            <iframe style={iframeStyle} />
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
          doc = iframe.contentWindow.document;

      // In order for iframe correctly render in some browsers
      // we need to do it on nextTick
      if (doc.readyState === 'complete') {

        /* jshint laxbreak: true */
        var cssText = baseCSS + mainCSS + params.css + baseFontCSS,
            css = <style dangerouslySetInnerHTML={{ __html: cssText }} />,
            Component,
            childParams,
            closeClasses = classSet({
              'u-posAbsolute': true,
              'u-posEnd': true,
              'u-posStart--vert': true,
              'Icon': true,
              'Icon--cross': true,
              'u-isActionable': true,
            }),
            closeButton = (params.fullscreenable && isMobileBrowser())
                        ? (<div onClick={this.hide}
                                onTouchEnd={this.hide}
                                className={closeClasses}></div>)
                        : null;

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
          render: function() {
            return (
              /* jshint quotmark: false */
              <div className='u-pullLeft'>
                {css}
                {childFn(childParams)}
                {closeButton}
              </div>
            );
          }
        });

        child = React.renderComponent(<Component />, doc.body);

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
