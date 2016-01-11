import React, { Component, PropTypes } from 'react';

import { IpmDesktop } from 'component/IpmDesktop';

class Ipm extends Component {
  constructor(props, context) {
    super(props, context);
    this.ipmSender = this.ipmSender.bind(this);
    this.state = {
      ipm: {
        id: null,
        name: '',
        type: '',
        recipientEmail: '',
        message: {}
      },
      url: '',
      ipmAvailable: null,
      isMobile: props.mobile
    };
  }

  ipmSender(name) {
    const params = {
      event: {
        campaignId: this.state.ipm.id,
        email: this.state.ipm.recipientEmail,
        type: name,
        url: this.state.url
      }
    };

    this.props.ipmSender(params);
  }

  render() {
    return (
      <IpmDesktop
        {...this.state}
        updateFrameSize={this.props.updateFrameSize}
        ipmSender={this.ipmSender} />
    );
  }
}

Ipm.propTypes = {
  setFrameSize: PropTypes.func.isRequired,
  updateFrameSize: PropTypes.func.isRequired,
  ipmSender: PropTypes.func.isRequired,
  mobile: PropTypes.bool.isRequired
};

export { Ipm };
