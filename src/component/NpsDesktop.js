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

export const NpsDesktop = React.createClass({
  render() {
    const commentsClasses = classSet({
      'u-isHidden': this.props.response.rating === null
    });
    const sendButtonClasses = classSet({
      /* jshint laxbreak: true */
      'u-isHidden': (!this.props.commentFieldDirty
                     || this.props.isSubmittingComment
                     || this.props.surveyCompleted)
    });
    const submittingCommentLoadingClasses = classSet({
      'u-isHidden': !this.props.isSubmittingComment
    });
    const thankYouClasses = classSet({
      'u-textCenter': true,
      'u-isHidden': !this.props.surveyCompleted
    });
    const ratingListItemTemplate = (rating) => {
      const isSelected = this.props.response.rating === rating;
      const props = {
        label: rating,
        loading: isSelected && this.props.isSubmittingRating,
        selected: isSelected,
        highlightColor: this.props.survey.highlightColor,
        onClick: this.props.ratingClickHandler(rating)
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
          <p>{this.props.survey.question}</p>

          <ol className='nps-ratings'>
            {ratingListItems}
          </ol>

          <div className={commentsClasses}>
            <form onSubmit={this.props.submitCommentHandler}>
              <Field
                ref='commentField'
                placeholder={this.props.survey.commentsQuestion}
                value={this.props.response.comment}
                name='comment'
                input={<textarea rows="2"></textarea>}
                onChange={this.props.onChangeHandler} />

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
