/** @jsx React.DOM */
module React from 'react';
import { getSizingRatio } from 'util/devices';

require('imports?_=lodash!lodash');

var baseCSS = require('baseCSS'),
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
        css: ''
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

    updateFrameSize: function(offsetWidth = 0, offsetHeight = 0) {
      var iframe = this.getDOMNode(),
          frameWin = iframe.contentWindow,
          frameDoc = iframe.contentDocument,
          dimensions;

      if (!frameDoc.firstChild) {
        return false;
      }

      dimensions = function() {
        var el = frameDoc.body.firstChild,
            width  = Math.max(el.clientWidth,  el.offsetWidth),
            height = Math.max(el.clientHeight, el.offsetHeight);

        return {
          width:  (_.isFinite(width)  ? width  : 0) + offsetWidth,
          height: (_.isFinite(height) ? height : 0) + offsetHeight
        };
      };

      frameWin.setTimeout( () => this.setState({iframeDimensions: dimensions()}), 0);
    },

    show: function() {
      this.setState({
        visible: true
      });

      if (params.onShow) {
        params.onShow();
      }
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
                         : {visibility: 'hidden'},
          iframeStyle = _.extend(
            { border: 'none', background: 'transparent !important' },
            params.style,
            visibilityRule,
            this.state.iframeDimensions
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
        var cssText = baseCSS + mainCSS + params.css + baseFontCSS,
            css = <style dangerouslySetInnerHTML={{ __html: cssText }} />,
            Component,
            childParams;

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
