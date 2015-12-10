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
        recipientEmail: '',
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
      email: this.state.ipm.recipientEmail,
      type: name,
      url: this.state.url
    };

    this.props.ipmSender(params);
  },

  render() {
    return (
      <IpmDesktop
        {...this.state}
        updateFrameSize={this.props.updateFrameSize}
        ipmSender={this.ipmSender} />
    );
  }
});
