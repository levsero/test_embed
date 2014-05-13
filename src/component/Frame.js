/** @jsx React.DOM */
/* jshint multistr:true */

module React from 'react'; /* jshint ignore:line */

// lodash needs to shimmed using imports loader
require('imports?_=lodash!lodash');
var baseCSS = require('baseCSS');
var mainCSS = require('mainCSS');

export var Frame = React.createClass({
  propTypes: {
    style: React.PropTypes.object.isRequired,
    css:   React.PropTypes.string.isRequired
  },

  render: function() {
    var base = { border: 'none' },
        iframeStyle = _.extend(base, this.props.style);

    return <iframe style={iframeStyle} />;
  },

  componentDidMount: function() {
    // In order for iframe correctly render we need to do it on nextTick
    if(this.getDOMNode().contentWindow.document.readyState === 'complete') {
      this.renderFrameContent();
    } else {
      setTimeout(this.renderFrameContent, 100);
    }
  },

  componentDidUpdate: function() {
    var doc = this.getDOMNode().contentWindow.document;

    React.renderComponent(this.props.children, doc.body);
  },

  renderFrameContent: function() {
    var doc = this.getDOMNode().contentWindow.document,
        cssText = baseCSS + mainCSS + this.props.css,
        css = <style dangerouslySetInnerHTML={{ __html: cssText }} />;

    React.renderComponent(css, doc.head);
    React.renderComponent(this.props.children, doc.body);
  },

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }
});
