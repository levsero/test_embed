import React from 'react/addons';
import _     from 'lodash';

import { IpmDesktop } from 'component/IpmDesktop';

export const Ipm = React.createClass({
  propTypes: {
    updateFrameSize: React.PropTypes.func,
    ipmSender: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      ipm: {
        message: '',
        signOff: ''
      },
      ipmAvailable: null
    };
  },

  ipmSender(params, doneFn, failFn) {
    const fail = (error) => {
      this.setError(true);
      this.setState({isSubmittingRating: false, isSubmittingComment: false});
      if (failFn) {
        failFn(error);
      }
    };

    const done = () => {
      this.setError(false);
      this.setState({isSubmittingRating: false, isSubmittingComment: false});
      if (doneFn) {
        doneFn();
      }
    };

    this.setError(false);
    this.props.ipmSender(params, done, fail);
  },

  sendResponse(doneFn, failFn) {
    const params = {
      ipmResponse: {
        surveyId: this.state.survey.id,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating,
        comment: this.state.response.comment
      }
    };

    this.ipmSender(params, doneFn, failFn);
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
          updateFrameSize={this.props.updateFrameSize} />
  }
});
