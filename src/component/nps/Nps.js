import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { NpsDesktop } from 'component/nps/NpsDesktop';
import { NpsMobile } from 'component/nps/NpsMobile';
import { bindMethods } from 'utility/utils';

const initialState = {
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
  surveyAvailable: null // `null`: survey has not been set
};

export class Nps extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, Nps.prototype);

    const state =_.extend({}, initialState, { isMobile: props.mobile });

    this.state = state;
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

  resetState(mergeObj = {}) {
    const state = _.extend({}, initialState, { isMobile: this.state.isMobile }, mergeObj);

    this.setState(state);
  }

  render() {
    return (this.state.isMobile)
      ? <NpsMobile
          ref='mobile'
          {...this.state}
          setFrameSize={this.props.setFrameSize}
          golionLogo={this.props.golionLogo}
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          submitRatingHandler={this.submitRatingHandler}
          updateRating={this.updateRating} />
      : <NpsDesktop
          ref='desktop'
          {...this.state}
          golionLogo={this.props.golionLogo}
          submitRatingHandler={this.submitRatingHandler}
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          updateFrameSize={this.props.updateFrameSize}
          setOffsetHorizontal={this.props.setOffsetHorizontal} />;
  }
}

Nps.propTypes = {
  npsSender: PropTypes.func.isRequired,
  mobile: PropTypes.bool.isRequired,
  setOffsetHorizontal: PropTypes.func,
  setFrameSize: PropTypes.func,
  updateFrameSize: PropTypes.func,
  golionLogo: PropTypes.bool
};

Nps.defaultProps = {
  setOffsetHorizontal: () => {},
  setFrameSize: () => {},
  updateFrameSize: () => {},
  golionLogo: false
};
