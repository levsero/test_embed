import React from 'react/addons';

import { IpmDesktop } from 'component/IpmDesktop';

export const Ipm = React.createClass({
  propTypes: {
    setFrameSize: React.PropTypes.func.isRequired,
    updateFrameSize: React.PropTypes.func.isRequired,
    ipmSender: React.PropTypes.func.isRequired,
    mobile: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return {
      ipm: {
        id: null,
        name: '',
        type: '',
        message: {}
      },
      ipmAvailable: null,
      isMobile: this.props.mobile
    };
  },

  render() {
    /* jshint laxbreak: true */
    return (this.state.isMobile)
      ? <div
          ref='mobile'
          {...this.state}
          setFrameSize={this.props.setFrameSize}
          eventSender={this.props.eventSender} />
      : <IpmDesktop
          ref='desktop'
          {...this.state}
          updateFrameSize={this.props.updateFrameSize}
          eventSender={this.props.eventSender} />;
  }
});
