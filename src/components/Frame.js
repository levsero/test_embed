/** @jsx React.DOM */
/* jshint multistr:true */

module React from 'react'; /* jshint ignore:line */

var _ = require('lodash');
var baseCSS = require('baseCSS');

export var Frame = React.createClass({
  render: function() {
    var base = { border: 'none' },
    iframeStyle = _.extend(base, this.props.style);
    return <iframe style={iframeStyle} />;
  },

  componentDidMount: function() {
    // In order for iframe correctly render we need to do it on nextTick
    setTimeout(this.renderFrameContent, 10);
  },

  renderFrameContent: function() {
    var head = this.getDOMNode().contentDocument.head,
        styleTag = document.createElement('style');

    head.appendChild(styleTag);
    styleTag.innerHTML = baseCSS;
    React.renderComponent(this.props.children, this.getDOMNode().contentDocument.body);
  },

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }
});
