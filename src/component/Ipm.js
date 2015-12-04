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
        message: '',
        sender: '',
        avatarUrl: '',
        buttonText: '',
        buttonLink: '',
        buttonColor: ''
      },
      ipmAvailable: null,
      isMobile: this.props.mobile
    };
  },

  ipmSender(params, doneFn, failFn) {
    const fail = (error) => {
      if (failFn) {
        failFn(error);
      }
    };

    const done = () => {
      if (doneFn) {
        doneFn();
      }
    };

    this.props.ipmSender(params, done, fail);
  },

  render() {
    return (
      <IpmDesktop
        {...this.state}
        updateFrameSize={this.props.updateFrameSize} />
    );
  }
});
