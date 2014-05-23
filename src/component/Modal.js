/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
require('imports?_=lodash!lodash');

export var Modal = React.createClass({
  propTypes: {
    onRequestClose: React.PropTypes.func.isRequired
  },
  killClick: function(e) {
    // clicks on the content shouldn't close the modal
    e.stopPropagation();
  },

  getInitialState: function() {
    return {show: false};
  },

  render: function() {
    var backdropStyle = {
      position: 'fixed',
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
      background: 'rgba(0,0,0,0.5)'
    };

    var visibilityRule = (this.state.show) ? {} : {display: 'none'};
    backdropStyle = _.extend(backdropStyle, visibilityRule);

    return (
      <div style={backdropStyle} onClick={this.props.onRequestClose}>
        <div onClick={this.killClick}>
          {this.props.children}
        </div>
      </div>
    );
    }
});
