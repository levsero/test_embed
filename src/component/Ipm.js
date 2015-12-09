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
        userEmail: 'test',
        message: {}
      },
      url: '',
      ipmAvailable: null,
      isMobile: this.props.mobile
    };
  },

  ipmSender(name) {
    const params = {
      campainId: this.state.ipm.id,
      email: this.state.ipm.userEmail,
      type: name,
      url: this.state.url
    };

    this.props.ipmSender(params);
  },

  render() {
    /* jshint laxbreak: true */
    return (this.state.isMobile)
      ? <div
          ref='mobile'
          {...this.state}
          setFrameSize={this.props.setFrameSize}
          eventSender={this.ipmSender} />
      : <IpmDesktop
          ref='desktop'
          {...this.state}
          updateFrameSize={this.props.updateFrameSize}
          eventSender={this.ipmSender} />;
  }
});
