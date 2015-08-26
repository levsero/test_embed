import React from 'react/addons';
import _     from 'lodash';

import { Button,
         ButtonGroup,
         ButtonSecondary } from 'component/Button';
import { Container } from 'component/Container';
import { Field } from 'component/FormField';
import { Loading } from 'component/Loading';

const classSet = React.addons.classSet;

const RatingButton = React.createClass({
  getDefaultProps() {
    return {
      highlightColor: '',
      selected: false,
      loading: false,
      label: null
    };
  },
  render() {
    /* jshint laxbreak: true */
    // FIXME: css
    const style = (this.props.selected)
                ? {
                    borderColor: this.props.highlightColor,
                    background: this.props.highlightColor,
                    color: '#fff'
                  }
                : {};
    const content = (this.props.loading)
                  ? (<div style={{ width:'30px' }}>  {/* FIXME: css */}
                       <Loading />
                     </div>)
                  : (<ButtonSecondary
                       style={style}
                       label={`${this.props.label}`}
                       onClick={this.props.onClick} />);

    return content;
  }
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
        recipientId: null
      },
      response: {
        rating: null,
        comment: ''
      },
      commentFieldDirty: false,
      isSubmittingRating: false,
      isSubmittingComment: false,
      surveyCompleted: false
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

  onChangeHandler(ev) {
    this.setState({
      response: _.extend({}, this.state.response, { comment: ev.target.value }),
      commentFieldDirty: true
    });
  },

  reset() {
    this.setState(this.getInitialState());
  },

  render() {
    /* jshint laxbreak: true */
    if (this.props.updateFrameSize) {
      setTimeout(() => this.props.updateFrameSize(), 0);
    }

    const commentsClasses = classSet({
      'u-isHidden': this.state.response.rating === null
    });
    const sendButtonClasses = classSet({
      'u-isHidden': (!this.state.commentFieldDirty
                     || this.state.isSubmittingComment
                     || this.state.surveyCompleted)
    });
    const submittingCommentLoadingClasses = classSet({
      'u-isHidden': !this.state.isSubmittingComment
    });
    const thankYouClasses = classSet({
      'u-textCenter': true,
      'u-isHidden': !this.state.surveyCompleted
    });
    const ratingListItemTemplate = (rating) => {
      const isSelected = this.state.response.rating === rating;
      const props = {
        label: rating,
        loading: isSelected && this.state.isSubmittingRating,
        selected: isSelected,
        highlightColor: this.state.survey.highlightColor,
        onClick: this.ratingClickHandler(rating)
      };

      return (
        <li>
          <RatingButton {...props} />
        </li>
      );
    };
    const ratingListItems = _.range(11) // 0...10
                             .map(ratingListItemTemplate);

    return (
      <Container style={this.props.style}>
        <div style={{ padding: '35px 10px 10px' }}> {/* FIXME: css */}
          <p>{this.state.survey.question}</p>

          <ol className='nps-ratings'>
            {ratingListItems}
          </ol>

          <div className={commentsClasses}>
            <form onSubmit={this.submitCommentHandler}>
              <Field
                ref='commentField'
                placeholder={this.state.survey.commentsQuestion}
                value={this.state.response.comment}
                name='comment'
                input={<textarea rows="2"></textarea>}
                onChange={this.onChangeHandler} />

              <ButtonGroup
                style={{ marginTop: '10px' }}
                rtl={false}>
                <Button
                  type='submit'
                  className={sendButtonClasses}
                  label='Send' /> {/* FIXME: i18n */}
              </ButtonGroup>
            </form>
          </div>

          <div
            className={submittingCommentLoadingClasses}
            style={{paddingTop: '16px', paddingRight: '35px', height: '21px'}}> {/* FIXME: css */}
            <Loading className='u-textRight' />
          </div>

          <div
            className={thankYouClasses}
            style={{ fontWeight:'bold' }}>
            Thank you for your response!  {/* FIXME: i18n */}
          </div>
        </div>
      </Container>
    );
  }
});
