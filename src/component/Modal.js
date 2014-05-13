/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */

export var Modal = React.createClass({
    killClick: function(e) {
        // clicks on the content shouldn't close the modal
        e.stopPropagation();
    },
    handleClick: function() {
        // when you click the background, the user is requesting that the modal gets closed.
        // note that the modal has no say over whether it actually gets closed. the owner of the
        // modal owns the state. this just "asks" to be closed.
        this.props.onRequestClose();
    },
    render: function() {
      var BackdropStyle = {
        position: 'fixed',
        left: '0',
        right: '0',
        top: '0',
        bottom: '0',
        background: 'rgba(0,0,0,0.5)'
      };
      var ContentStyle = {
        background: 'white',
        margin: 'auto',
        width: '400px'
      };
      return this.transferPropsTo(
        /* jshint quotmark: false */
        <div className="ModalBackdrop" style={BackdropStyle} onClick={this.handleClick}>
          <div className="ModalContent" style={ContentStyle} onClick={this.killClick}>
            {this.props.children}
          </div>
        </div>
      );
    }
});
