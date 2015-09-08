import React from 'react/addons';
import _     from 'lodash';

import { NpsDesktop } from 'component/NpsDesktop';

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
        recipientId: null
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

  sendRating() {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.surveyId,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating
      }
    };
    const doneFn = () => {
      this.setState({ isSubmittingRating: false });
    };
    const failFn = () => {};

    this.props.npsSender(params, doneFn, failFn);
  },

  sendComment() {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.surveyId,
        recipientId: this.state.survey.recipientId,
        rating: this.state.response.rating,
        comment: this.state.response.comment
      }
    };
    const doneFn = () => {
      this.setState({
        isSubmittingComment: false,
        surveyCompleted: true
      });
    };
    const failFn = () => {};

    this.props.npsSender(params, doneFn, failFn);
  },

  ratingClickHandler(rating) {
    return () => {
      this.setState({
        response: _.extend({}, this.state.response, { rating: rating }),
        isSubmittingRating: true
      });
      setTimeout(this.sendRating, 0);
      setTimeout(() => {
        this.refs.commentField.refs.field.getDOMNode().focus();
      }, 100);
    };
  },

  submitCommentHandler(ev) {
    ev.preventDefault();
    this.setState({ isSubmittingComment: true });
    setTimeout(this.sendComment, 0);
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
    if (this.props.updateFrameSize) {
      setTimeout(() => this.props.updateFrameSize(), 0);
    }

    /* jshint laxbreak: true */
    return (this.state.isMobile)
      ? <div
          className='nps-mobile'
          style={{background: 'red', height: 100, width: 100}} />
      : <NpsDesktop
          {...this.state}
          ratingClickHandler={this.ratingClickHandler}
          submitCommentHandler={this.submitCommentHandler}
          onCommentChangeHandler={this.onCommentChangeHandler}
          sendComment={this.sendComment} />;
  }
});
