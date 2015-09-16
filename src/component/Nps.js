import React from 'react/addons';
import _     from 'lodash';

import { NpsDesktop } from 'component/NpsDesktop';
import { NpsMobile } from 'component/NpsMobile';

const retryThreshold = 1;
const apply = _.curry((args, func) => {
  return func.apply(null, args);
});

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
  npsSender(params, success, fail) {
    this.setState(_.extend(this.state.survey, { error: false }));
    this.props.npsSender(params, success, fail);
  },
  retry(toRetry, tries = 0) {
    if (tries < retryThreshold) {
      toRetry();
    }
  },
  responseFailure(tries, toRetry, failureCallbacks = []) { //curry me please
    return (err) => {
      if (err.timeout && tries < retryThreshold) {
        this.retry(toRetry, tries);
      } else {
        this.setState({isSubmittingRating: false, isSubmittingComment: false});
        this.setState(_.extend(this.state.survey, { error: true }));
        failureCallbacks.map(apply([err]));
      }
    };
  },
  responseSuccess(successCallbacks) {
    return (...args) => {
      this.setState({isSubmittingRating: false, isSubmittingComment: false});
      this.setState(_.extend(this.state.survey, { error: false }));
      successCallbacks.map(apply(args));
    };
  },
  sendRating(successCallbacks = [], failureCallbacks = [], tries = 0) {
    const toRetry = () => this.sendRating(successCallbacks, failureCallbacks, (tries + 1));

    const params = {
      npsResponse: {
        surveyId: this.state.survey.surveyId,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating
      }
    };

    this.npsSender(params,
      this.responseSuccess(successCallbacks),
      this.responseFailure(tries, toRetry, failureCallbacks)
    );
  },
  sendComment(successCallbacks = [], failureCallbacks = [], tries = 0) {
    const toRetry = () => this.sendComment(successCallbacks, failureCallbacks, (tries + 1));

    const params = {
      npsResponse: {
        surveyId: this.state.survey.surveyId,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating,
        comment: this.state.response.comment
      }
    };

    successCallbacks = successCallbacks.concat([() => this.setState({ surveyCompleted: true })]);

    this.npsSender(params,
      this.responseSuccess(successCallbacks),
      this.responseFailure(tries, toRetry, failureCallbacks)
    );
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
          onCommentChangeHandler={this.onCommentChangeHandler} />
      : <NpsDesktop
          {...this.state}
          ratingClickHandler={this.ratingClickHandler}
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          sendComment={this.sendComment} />;
  }
});
