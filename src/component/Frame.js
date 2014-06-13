/** @jsx React.DOM */
/* jshint multistr:true */

module React from 'react'; /* jshint ignore:line */

// lodash needs to shimmed using imports loader
require('imports?_=lodash!lodash');
var baseCSS = require('baseCSS'),
    mainCSS = require('mainCSS');

export var Frame = React.createClass({
  propTypes: {
    style:    React.PropTypes.object.isRequired,
    css:   React.PropTypes.string.isRequired,
    visibility: React.PropTypes.bool.isRequired
  },

  getInitialState: function() {
    return {
      show: this.props.visibility
    };
  },

  getDefaultProps: function() {
    return {
      style: null,
      css: null,
      hide: false,
      closable: false
    };
  },

  getInitialState: function() {
    return {
      show: true
    };
  },

  toggleVisibility: function() {
    this.setState({show: !this.state.show});
  },

  render: function() {
    var visibilityRule = (this.state.show) ? {} : {display: 'none'},
        base = { border: 'none' },
        iframeStyle = _.extend(base, this.props.style, visibilityRule);

    if(!this.state.show) {
      iframeStyle = _.extend(iframeStyle, {display: 'none'});
    }

    return <iframe style={iframeStyle} />;
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

  componentWillMount: function() {
    if(this.props.hide) {
      this.setState({show: false});
    }
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
    /* jshint quotmark:false, laxcomma:true */
    if (doc.readyState === 'complete') {
      var cssText = baseCSS + mainCSS + this.props.css,
          classes = this.props.closable ? '' : 'u-isHidden',
          css = <style dangerouslySetInnerHTML={{ __html: cssText }} />,
          contents = (
            <div>
              {css}
              <div
                  className={classes + ' u-posAbsolute u-posEnd'}
                  onClick={this.toggleVisibility}
              >
                X
              </div>
              {this.props.children}
            </div>
          );

      React.renderComponent(contents, doc.body);
    } else {
      setTimeout(this.renderFrameContent, 0);
    }
  },

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }
});
