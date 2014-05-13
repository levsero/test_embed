/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */

import { ReactLayeredComponentMixin } from 'mixin/ReactLayeredComponent';
import { Modal } from 'component/Modal';

export var CloseHandler = React.createClass({
  mixins: [ReactLayeredComponentMixin],
  handleClick: function() {
    this.setState({shown: !this.state.shown});
  },
  getInitialState: function() {
    return {shown: true};
  },
  render: function() {
    return <span />;
  },
  renderLayer: function() {
    if (!this.state.shown) {
        return <span />;
    }
    return (
      <Modal onRequestClose={this.handleClick}>
         {this.props.children}
      </Modal>
    );
  }
});
