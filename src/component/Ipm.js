import React from 'react/addons';

import { IpmDesktop } from 'component/IpmDesktop';

export const Ipm = React.createClass({
  propTypes: {
    updateFrameSize: React.PropTypes.func,
    ipmSender: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      ipm: {
        id: null,
        message: '',
        signOff: ''
      },
      ipmAvailable: null
    };
  },

  ipmSender(params, doneFn, failFn) {
    const fail = (error) => {
      this.setState({isSubmittingRating: false, isSubmittingComment: false});
      if (failFn) {
        failFn(error);
      }
    };

    const done = () => {
      this.setState({isSubmittingRating: false, isSubmittingComment: false});
      if (doneFn) {
        doneFn();
      }
    };

    this.props.ipmSender(params, done, fail);
  },

  render() {
    /* jshint laxbreak: true */
    return (this.state.isMobile)
      ? <div
          ref='mobile'
          {...this.state}
          setFrameSize={this.props.setFrameSize} />
      : <IpmDesktop
          ref='desktop'
          {...this.state}
          updateFrameSize={this.props.updateFrameSize} />;
  }
});
