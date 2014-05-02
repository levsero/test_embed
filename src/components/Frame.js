/** @jsx React.DOM */
/* jshint multistr:true */

import { _ } from 'lodash';
module React from 'react'; /* jshint ignore:line */

export var Frame = React.createClass({
  documentNormalizer: function() {
    return (
      'body {              \
         margin:0;         \
         padding: 0px;     \
         background: none; \
      }                    \
      .Launcher {             \
         position: fixed;              \
         width: 50px;                  \
         height: 50px;                 \
         background: rgba(0,0,0,.7);   \
         text-align: center;           \
         color: #fff;                  \
         padding: 0;                   \
         font-family: sans-serif;       \
         font-size: 12px;               \
         border-radius: 25px 25px 3px; \
         cursor: pointer;              \
      }\
      .Launcher--left { \
        border-radius: 25px 25px 25px 3px; \
      }\
      .Launcher > div {       \
         font-family: sans-serif; \
         font-weight: normal; \
         font-size: 26px; \
         margin-top: 11px; \
      }');
  },

  render: function() {
    var base = { border: 'none' },
    iframeStyle = _.extend(base, this.props.style);
    return <iframe style={iframeStyle} />;
  },

  componentDidMount: function() {
    var head;
    React.renderComponent(this.props.children, this.getDOMNode().contentDocument.body);
    head = this.getDOMNode().contentDocument.head;

    var styleTag = document.createElement('style');
    head.appendChild(styleTag);
    styleTag.innerHTML = this.documentNormalizer() + ' ' + this.props.documentStyle;
  },

  componentDidUpdate: function() {
    React.renderComponent(this.props.children, this.getDOMNode().contentDocument.body);
  },

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }

});
