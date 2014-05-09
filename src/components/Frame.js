/** @jsx React.DOM */
/* jshint multistr:true */

module React from 'react'; /* jshint ignore:line */

// lodash needs to shimmed using imports loader
require('imports?_=lodash!lodash');
var baseCSS = require('baseCSS');
var mainCSS = require('mainCSS');
var componentsCSS = require('components/Form.scss') + " " +
                    require('components/Container.scss') + " " +
                    require('components/Button.scss') + " ";

export var Frame = React.createClass({
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

  renderFrameContent: function() {
    var head = this.getDOMNode().contentDocument.head,
        styleTag = document.createElement('style');

    head.appendChild(styleTag);
    styleTag.innerHTML = baseCSS + " " + mainCSS + " " + componentsCSS;
    React.renderComponent(this.props.children, this.getDOMNode().contentWindow.document.body);
  },

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }
});
