/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
import { Frame    } from 'component/Frame';

require('imports?_=lodash!lodash');

export var wrapperFactory = function(params) {
  return _.extend({
    getInitialState: function() {
      return ({
        iframeDimensions: {
          height: 0,
          width: 0
        }
      });
    },
    updateFrameSize: function() {
      var win = this.refs.frame.getDOMNode().contentWindow,
          dimensions;

      if (!win.document.firstChild) {
       return false;
      }

      dimensions = function() {
        var el = win.document.body.firstChild;
        return ({
          width:  Math.max(el.clientWidth,  el.offsetWidth, el.clientWidth),
          height: Math.max(el.clientHeight, el.offsetHeight, el.clientHeight)
        });
      };

      this.setState({iframeDimensions: dimensions()});
    },
    hide: function() {
      this.refs.frame.hide();
    },
    show: function() {
      this.refs.frame.show();
    },
    render: function() {
      return (
        /* jshint quotmark: true */
        <Frame ref='frame'
          style={_.extend(params.iframeStyle, this.state.iframeDimensions)}
          css={params.css}
          visibility={true}>
          {params.child({
            updateFrameSize: this.updateFrameSize,
            onClickHandler: this.onClickHandler
          })}
        </Frame>
      );
    }
  }, params.extend);
}
