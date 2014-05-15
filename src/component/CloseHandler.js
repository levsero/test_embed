/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
import { Modal } from 'component/Modal';

export var CloseHandler = React.createClass({
  handleClick: function() {
    this.setState({shown: !this.state.shown});
  },
  getInitialState: function() {
    return {shown: true};
  },
  render: function() {
    if (!this.state.shown) {
        return <span />;
    }
    return (
      <Modal onRequestClose={this.handleClick}>
         {this.props.children}
      </Modal>
    );
  },
});
