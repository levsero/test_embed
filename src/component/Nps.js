import React from 'react/addons';
import _     from 'lodash';

import { NpsDesktop } from 'component/NpsDesktop';
import { NpsMobile } from 'component/NpsMobile';

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

  setError(errorState) {
    this.setState({
      survey: _.extend(this.state.survey, { error: errorState })
    });
  },

  npsSender(params, success, fail) {
    this.setError(false);
    this.props.npsSender(params, success, fail);
  },

  responseFailure() {
    this.setError(true);
    this.setState({isSubmittingRating: false, isSubmittingComment: false});
  },

  responseSuccess(successCallback) {
    this.setError(false);
    this.setState({isSubmittingRating: false, isSubmittingComment: false});
    if (successCallback) {
      successCallback();
    }
  },

  sendRating(successCallback) {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.surveyId,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating
      }
    };

    this.npsSender(
      params,
      this.responseSuccess.bind(this, successCallback),
      this.responseFailure
    );
  },

  sendComment(successCallback) {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.surveyId,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating,
        comment: this.state.response.comment
      }
    };

    this.npsSender(
      params,
      this.responseSuccess.bind(this, successCallback),
      this.responseFailure
    );
  },

  ratingClickHandler(rating) {
    return (ev, successCallback) => {
      this.setState({
        response: _.extend({}, this.state.response, { rating: rating }),
        isSubmittingRating: true
      });
      setTimeout(() => this.sendRating(successCallback), 0);
      setTimeout(() => {
        if (!this.state.isMobile) {
          this.refs.commentField.refs.field.getDOMNode().focus();
        }
      }, 100);
    };
  },

  submitCommentHandler(ev, successCallback) {
    ev.preventDefault();
    this.setState({ isSubmittingComment: true });
    setTimeout(() => this.sendComment(successCallback), 0);
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
          onCommentChangeHandler={this.onCommentChangeHandler} />
      : <NpsDesktop
          {...this.state}
          ratingClickHandler={this.ratingClickHandler}
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          sendComment={this.sendComment} />;
  }
});
