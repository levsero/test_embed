import React, { Component, PropTypes } from 'react';
import _     from 'lodash';

import { NpsDesktop } from 'component/NpsDesktop';
import { NpsMobile } from 'component/NpsMobile';

class Nps extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onCommentChangeHandler = this.onCommentChangeHandler.bind(this);
    this.submitCommentHandler = this.submitCommentHandler.bind(this);
    this.submitRatingHandler = this.submitRatingHandler.bind(this);
    this.updateRating = this.updateRating.bind(this);

    this.state = {
      survey: {
        commentsQuestion: '',
        highlightColor: '',
        id: null,
        logoUrl: '',
        question: '',
        recipientId: null,
        error: false,
        thankYou: '',
        youRated: '',
        likelyLabel: '',
        notLikelyLabel: '',
        feedbackPlaceholder: ''
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
      isMobile: props.mobile
    };
  }

  setError(errorState) {
    this.setState({
      survey: _.extend({}, this.state.survey, { error: errorState })
    });
  }

  npsSender(params, doneFn, failFn) {
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
    this.props.npsSender(params, done, fail);
  }

  sendRating(doneFn, failFn) {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.id,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating
      }
    };

    this.npsSender(params, doneFn, failFn);
  }

  sendComment(doneFn, failFn) {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.id,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating,
        comment: this.state.response.comment
      }
    };

    this.npsSender(params, doneFn, failFn);
  }

  submitRatingHandler(rating, doneFn) {
    const errorHandler = () => {
      this.setState({
        response: _.extend({}, this.state.response, { rating: null })
      });
    };

    this.setState({
      response: _.extend({}, this.state.response, { rating }),
      isSubmittingRating: true
    });

    setTimeout(() => this.sendRating(doneFn, errorHandler), 0);
  }

  updateRating(rating) {
    this.setState({
      response: _.extend({}, this.state.response, { rating })
    });
  }

  submitCommentHandler(ev, doneFn, failFn) {
    ev.preventDefault();
    this.setState({ isSubmittingComment: true });
    setTimeout(() => this.sendComment(doneFn, failFn), 0);
  }

  onCommentChangeHandler(ev) {
    this.setState({
      response: _.extend({}, this.state.response, { comment: ev.target.value }),
      commentFieldDirty: true
    });
  }

  reset() {
    this.setState(this.getInitialState());
  }

  render() {
    return (this.state.isMobile)
      ? <NpsMobile
          ref='mobile'
          {...this.state}
          setFrameSize={this.props.setFrameSize}
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          submitRatingHandler={this.submitRatingHandler}
          updateRating={this.updateRating} />
      : <NpsDesktop
          ref='desktop'
          {...this.state}
          submitRatingHandler={this.submitRatingHandler}
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          updateFrameSize={this.props.updateFrameSize}
          setOffsetHorizontal={this.props.setOffsetHorizontal} />;
  }
}

Nps.propTypes = {
  npsSender: React.PropTypes.func.isRequired,
  mobile: React.PropTypes.bool.isRequired,
  setFrameSize: React.PropTypes.func.isRequired,
  setOffsetHorizontal: React.PropTypes.func.isRequired,
  updateFrameSize: React.PropTypes.func
};

export { Nps }