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
    css: React.PropTypes.string.isRequired,
    visible: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      visible: this.props.visible
    };
  },

  getDefaultProps: function() {
    return {
      visible: true
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
    var visibleRule = (this.state.visible) ? {} : {display: 'none'},
        base = { border: 'none' },
        iframeStyle = _.extend(base, this.props.style, visibleRule);

    if(!this.state.show) {
      iframeStyle = _.extend(iframeStyle, {display: 'none'});
    }

    return <iframe style={iframeStyle} />;
  },

  show: function() {
    this.setState({
      visible: true
    });
  },

  hide: function() {
    this.setState({
      visible: false
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
    if (this.state._rendered) {
      return false;
    }

    var doc = this.getDOMNode().contentWindow.document;
    // In order for iframe correctly render in some browsers we need to do it on nextTick
    /* jshint quotmark:false, laxcomma:true */
    if (doc.readyState === 'complete') {
      var cssText = baseCSS + mainCSS + this.props.css,
          classes = this.props.closable ? '' : 'u-isHidden',
          css = <style dangerouslySetInnerHTML={{ __html: cssText }} />,
          contents = (
            /* jshint quotmark: false */
            <div className='u-pullLeft'>
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
      this.setState({_rendered: true});
    } else {
      setTimeout(this.renderFrameContent, 0);
    }
  },

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }
});
