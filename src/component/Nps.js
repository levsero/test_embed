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
      isMobile: this.props.mobile
    };
  },

  setError(errorState) {
    this.setState({
      survey: _.extend({}, this.state.survey, { error: errorState })
    });
  },

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
  },

  sendRating(doneFn, failFn) {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.id,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating
      }
    };

    this.npsSender(params, doneFn, failFn);
  },

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
  },

  submitRatingHandler(rating, doneFn) {
    const errorHandler = () => {
      this.setState({
        response: _.extend({}, this.state.response, { rating: null })
      });
    };

    this.setState({
      response: _.extend({}, this.state.response, { rating: rating }),
      isSubmittingRating: true
    });

    setTimeout(() => this.sendRating(doneFn, errorHandler), 0);
    setTimeout(() => {
      if (!this.state.isMobile) {
        this.refs.commentField.refs.field.getDOMNode().focus();
      }
    }, 100);
  },

  submitCommentHandler(ev, doneFn, failFn) {
    ev.preventDefault();
    this.setState({ isSubmittingComment: true });
    setTimeout(() => this.sendComment(doneFn, failFn), 0);
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
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          submitRatingHandler={this.submitRatingHandler} />
      : <NpsDesktop
          {...this.state}
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          sendComment={this.sendComment} />;
  }
});
