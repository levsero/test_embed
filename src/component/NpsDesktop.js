import React from 'react/addons';
import _     from 'lodash';

import { Container } from 'component/Container';
import { Icon } from 'component/Icon';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { NpsRatingsList } from 'component/NpsRatingsList';
import { NpsComment } from 'component/NpsComment';

const classSet = React.addons.classSet;

// Hardcoding magic numbers
const thankYouFrameSize = {
  height: '430px',
  width: '222px'
};

export const NpsDesktop = React.createClass({
  getInitialState() {
    return {
      currentPage: {
        selectingRating: true,
        thankYou: false,
        addingComment: false
      }
    };
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage.selectingRating && this.state.currentPage.addingComment) {
      this.refs.npsComment.focusField();
    }
  },

  setCurrentPage(page) {
    this.setState({
      currentPage: _.mapValues(
        this.getInitialState().currentPage,
        (_, key) => key === page
      )
    });
  },

  ratingChangeValueHandler(rating) {
    this.props.submitRatingHandler(rating, () => this.setCurrentPage('addingComment'));
  },

  submitCommentHandler(ev) {
    this.props.submitCommentHandler(ev, () => {
      this.setCurrentPage('thankYou');
    });
  },

  render() {
    /* jshint laxbreak: true */
    const NPS_RATINGS = _.range(11);
    const hideZendeskLogo = this.props.hideZendeskLogo;
    const hideRatingsLegend = this.state.currentPage.addingComment;
    const containerStyles = this.state.currentPage.thankYou
                          ? {width: 400, height: 192, margin: 15}
                          : {width: 620, margin: 15};

    const containerContentClasses = classSet({
      'Container-content': true,
      'u-paddingBL': hideZendeskLogo && !this.state.currentPage.addingComment
    });
    const thankYouClasses = classSet({
      'u-textCenter': true,
      'u-isHidden': !this.state.currentPage.thankYou
    });
    const surveyFormClasses = classSet({
      'u-isHidden': this.state.currentPage.thankYou
    });
    const surveyTitleClasses = classSet({
      'SurveyTitle u-textSize15 u-textCenter': true,
      'u-paddingTT': !this.state.currentPage.thankYou
    });
    const commentsClasses = classSet({
      'u-isHidden': !this.state.currentPage.addingComment
    });

    const surveyTitle = (this.state.currentPage.thankYou)
                      ? 'Thank you'
                      : this.props.survey.question;

    const zendeskLogo = (!hideZendeskLogo && !this.state.currentPage.addingComment)
                      ? <div className='u-textCenter u-paddingBM'>
                          <ZendeskLogo className='u-posStatic' fullscreen={false} />
                        </div>
                      : <div className='u-paddingBS'></div>;

    const ratingsList = (!this.state.currentPage.thankYou)
                      ? <div>
                          <NpsRatingsList
                            fullscreen={false}
                            hideRatingsLegend={hideRatingsLegend}
                            highlightColor={this.props.survey.highlightColor}
                            isSubmittingRating={this.props.isSubmittingRating}
                            likelyLabel={this.props.survey.likelyLabel}
                            notLikelyLabel={this.props.survey.notLikelyLabel}
                            ratingsRange={NPS_RATINGS}
                            selectedRating={this.props.response.rating}
                            onClick={this.ratingChangeValueHandler}
                            onChangeValue={this.ratingChangeValueHandler} />
                        </div>
                      : null;

    const commentsContent = <NpsComment
                              ref='npsComment'
                              fullscreen={false}
                              className={commentsClasses}
                              comment={this.props.response.comment}
                              feedbackPlaceholder={this.props.survey.feedbackPlaceholder}
                              isSubmittingComment={this.props.isSubmittingComment}
                              isSubmittingRating={this.props.isSubmittingRating}
                              onSubmit={this.submitCommentHandler}
                              onChange={this.props.onCommentChangeHandler} />;

    if (this.props.setFrameSize && this.state.currentPage.thankYou) {
      setTimeout(() => this.props.setFrameSize(
        thankYouFrameSize.height, thankYouFrameSize.width
      ), 0);
    }

    return (this.props.survey && this.props.survey.question)
         ? <Container
             card
             style={containerStyles}>
             <div className={containerContentClasses}>
               <h1 className={surveyTitleClasses}>{surveyTitle}</h1>

                <div className={surveyFormClasses}>
                  {ratingsList}
                  {commentsContent}
                </div>

                <div className={thankYouClasses}>
                  <Icon
                    type='Icon--tick'
                    className='u-inlineBlock u-userTextColor u-posRelative u-marginTL' />
                </div>
                {zendeskLogo}
              </div>
            </Container>
         : <Container></Container>;
  }
});
