import React from 'react/addons';
import _     from 'lodash';

import { NpsDesktop } from 'component/NpsDesktop';
import { NpsMobile } from 'component/NpsMobile';

const apply = (args) => { //curry me please
  return (func) => {
    return func.apply(null, args);
  };
};

export const Nps = React.createClass({
  propTypes: {
    updateFrameSize: React.PropTypes.func,
    npsSender: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      survey: {
        commentsQuestion: '',
        highlightColor: '',
        surveyId: null,
        logoUrl: '',
        question: '',
        recipientId: null,
        error: false
      },
      response: {
        rating: null,
        comment: ''
      },
      commentFieldDirty: false,
      isSubmittingRating: false,
      isSubmittingComment: false,
      surveyCompleted: false,
      surveyAvailable: null, // `null`: survey has not been set
      isMobile: this.props.mobile
    };
  },
  responseFailure(failureCallbacks=[]) { //curry me please
    return (...args) => {
      this.setState({ isSubmittingRating: false, isSubmittingComment: false });
      this.setState(_.extend(this.state.survey, { error: true }));
      failureCallbacks.map(apply(args));
    };
  },
  sendRating(successCallbacks=[], failureCallbacks=[]) {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.surveyId,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating
      }
    };

    const doneFn = (...args) => {
      this.setState({ isSubmittingRating: false });
      this.setState(_.extend(this.state.survey, { error: true }));
      successCallbacks.map(apply(args));
    };

    this.props.npsSender(params, doneFn, this.responseFailure(failureCallbacks));
  },

  sendComment(successCallbacks=[], failureCallbacks=[]) {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.surveyId,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating,
        comment: this.state.response.comment
      }
    };
    const doneFn = (...args) => {
      this.setState({
        isSubmittingComment: false,
        surveyCompleted: true
      });
      successCallbacks.map(apply(args));
    };
    this.props.npsSender(params, doneFn, this.responseFailure(failureCallbacks));
  },

  ratingClickHandler(rating) {
    return (ev, successCallbacks, failureCallbacks) => {
      this.setState({
        response: _.extend({}, this.state.response, { rating: rating }),
        isSubmittingRating: true
      });
      setTimeout(this.sendRating.bind(this, successCallbacks, failureCallbacks), 0);
      setTimeout(() => {
        if (!this.state.isMobile) {
          this.refs.commentField.refs.field.getDOMNode().focus();
        }
      }, 100);
    };
  },

  submitCommentHandler(ev, successCallbacks = [], failureCallbacks = []) {
    ev.preventDefault();
    this.setState({ isSubmittingComment: true });
    setTimeout(this.sendComment.bind(this, successCallbacks, failureCallbacks), 0);
  },

  onCommentChangeHandler(ev) {
    this.setState({
      response: _.extend({}, this.state.response, { comment: ev.target.value }),
      commentFieldDirty: true
    });
  },

  reset() {
    this.setState(this.getInitialState());
  },

  render() {
    if (this.props.updateFrameSize && !this.state.isMobile) {
      setTimeout(() => this.props.updateFrameSize(), 0);
    }
    /* jshint laxbreak: true */
    return (this.state.isMobile)
      ? <NpsMobile
          {...this.state}
          setFrameSize={this.props.setFrameSize}
          ratingClickHandler={this.ratingClickHandler}
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          sendComment={this.sendComment} />
      : <NpsDesktop
          {...this.state}
          ratingClickHandler={this.ratingClickHandler}
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          sendComment={this.sendComment} />;
  }
});
