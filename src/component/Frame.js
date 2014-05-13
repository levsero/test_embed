/** @jsx React.DOM */
/* jshint multistr:true */

module React from 'react'; /* jshint ignore:line */

// lodash needs to shimmed using imports loader
require('imports?_=lodash!lodash');
var baseCSS = require('baseCSS'),
    mainCSS = require('mainCSS');

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
    this.renderFrameContent();
  },

  componentDidUpdate: function() {
    this.renderFrameContent();
  },

  renderFrameContent: function() {
    var doc = this.getDOMNode().contentWindow.document;
    // In order for iframe correctly render in some browsers we need to do it on nextTick
    if(doc.readyState === 'complete') {
      var cssText = baseCSS + mainCSS + this.props.css,
          css = <style dangerouslySetInnerHTML={{ __html: cssText }} />;

      React.renderComponent(css, doc.head);
      React.renderComponent(this.props.children, doc.body);
    } else {
      setTimeout(this.renderFrameContent, 0);
    }
  },

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }
});
