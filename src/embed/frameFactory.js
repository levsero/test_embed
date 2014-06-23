/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */

require('imports?_=lodash!lodash');

var baseCSS = require('baseCSS'),
    mainCSS = require('mainCSS');

export var frameFactory = function(child, params) {
  var _child;

  return {
    getInitialState: function() {
      return ({
        show: true,
        _rendered: false,
        iframeDimensions: {
          height: 0,
          width: 0
        }
      });
    },

    getChild: function() {
      return _child;
    },

    updateFrameSize: function() {
      var frameWin = this.getDOMNode().contentWindow,
          frameDoc = this.getDOMNode().contentDocument,
          dimensions;

      if (!frameDoc.firstChild) {
       return false;
      }

      dimensions = function() {
        var el = frameDoc.body.firstChild;
        return ({
          width:  Math.max(el.clientWidth,  el.offsetWidth, el.clientWidth),
          height: Math.max(el.clientHeight, el.offsetHeight, el.clientHeight)
        });
      };
      frameWin.setTimeout(function() {
        this.setState({iframeDimensions: dimensions()});
      }.bind(this), 0);
    },

    show: function() {
      this.setState({
        show: true
      });
    },

    hide: function() {
      this.setState({
        show: false
      });
    },

    render: function() {
      var visibilityRule = (this.state.show) ? {} : {display: 'none'},
      base = { border: 'none' },
      iframeStyle = _.extend(
        base,
        params.style,
        visibilityRule,
        this.state.iframeDimensions
      );

      return <iframe style={iframeStyle} />;
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

      var doc = this.getDOMNode().contentWindow.document;

      // In order for iframe correctly render in some browsers
      // we need to do it on nextTick
      if (doc.readyState === 'complete') {
        var cssText = baseCSS + mainCSS + params.css,
            css = <style dangerouslySetInnerHTML={{ __html: cssText }} />,
            root = this,
            Component,
            childParams;

        childParams = _.reduce(params.extend, function(res, val, key) {
          res[key] = val.bind(root);
          return res;
        }, {});

        childParams = _.extend(childParams, {
          updateFrameSize: root.updateFrameSize
        });

        Component = React.createClass(_.extend({
          render: function() {
            return (
              <div className='u-pullLeft'>
                {css}
                {child(childParams)}
              </div>
            );
          }
        }, params.extend));

        _child = React.renderComponent(<Component />, doc.body);

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
