import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { classNames } from 'classnames';

import { Container } from 'component/Container';
import { Icon } from 'component/Icon';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { NpsRatingsList } from 'component/NpsRatingsList';
import { NpsComment } from 'component/NpsComment';

class NpsDesktop extends Component {
  static defaultProps = {
    hideZendeskLogo: false,
    isMobile: false,
    isSubmittingComment: false,
    isSubmittingRating: false,
    onCommentChangeHandler: () => {},
    submitCommentHandler: () => {},
    submitRatingHandler: () => {}
  };
  
  static propTypes = {
    response: React.PropTypes.object.isRequired,
    setOffsetHorizontal: React.PropTypes.func.isRequired,
    survey: React.PropTypes.object.isRequired,
    updateFrameSize: React.PropTypes.func.isRequired,
    hideZendeskLogo: React.PropTypes.bool,
    isMobile: React.PropTypes.bool,
    isSubmittingComment: React.PropTypes.bool,
    isSubmittingRating: React.PropTypes.bool,
    onCommentChangeHandler: React.PropTypes.func,
    submitCommentHandler: React.PropTypes.func,
    submitRatingHandler: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.ratingChangeValueHandler = this.ratingChangeValueHandler.bind(this);
    this.submitCommentHandler = this.submitCommentHandler.bind(this);
    this.state = {
      currentPage: {
        selectingRating: true,
        thankYou: false,
        addingComment: false
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage.selectingRating && this.state.currentPage.addingComment) {
      this.refs.npsComment.focusField();
    }
  }

  setCurrentPage(page) {
    this.setState({
      currentPage: _.mapValues(
        this.getInitialState().currentPage,
        (_, key) => key === page
      )
    });
  }

  ratingChangeValueHandler(rating) {
    this.props.submitRatingHandler(rating, () => this.setCurrentPage('addingComment'));
  }

  submitCommentHandler(ev) {
    this.props.submitCommentHandler(ev, () => {
      this.setCurrentPage('thankYou');
    });
  }

  render() {
    if (this.props.updateFrameSize) {
      setTimeout(() => { this.props.updateFrameSize(); }, 0);
    }

    const npsRatings = _.range(11);
    const hideZendeskLogo = this.props.hideZendeskLogo;
    const hideRatingsLegend = this.state.currentPage.addingComment;
    const containerStyles = this.state.currentPage.thankYou
                          ? {width: 400, margin: 15}
                          : {width: 620, margin: 15};

    if (this.props.setOffsetHorizontal && this.state.currentPage.thankYou) {
      setTimeout(() => { this.props.setOffsetHorizontal(-215); }, 0);
    }

    const iconClasses = 'u-inlineBlock u-userFillColor u-posRelative u-marginTL';

    const containerClasses = classNames({
      'u-paddingBS': hideZendeskLogo && !this.state.currentPage.addingComment
    });
    const containerContentClasses = classNames({
      'Container-content': true,
      'u-paddingBL': hideZendeskLogo && !this.state.currentPage.addingComment
    });
    const surveyFormClasses = classNames({
      'u-isHidden': this.state.currentPage.thankYou
    });
    const surveyTitleClasses = classNames({
      'u-textSize15 u-textCenter': true,
      'u-paddingTT': !this.state.currentPage.thankYou
    });
    const commentsClasses = classNames({
      'u-paddingBL': true,
      'u-isHidden': !this.state.currentPage.addingComment
    });
    const ratingsListClasses = classNames({
      'RatingsList is-desktop': true
    });

    let surveyTitle = this.props.survey.question;

    if (this.state.currentPage.addingComment) {
      surveyTitle = this.props.survey.commentsQuestion;
    } else if (this.state.currentPage.thankYou) {
      surveyTitle = this.props.survey.thankYou;
    }

    const zendeskLogo = (!hideZendeskLogo && !this.state.currentPage.addingComment)
                      ? (<div className='u-textCenter u-paddingBM'>
                           <ZendeskLogo
                             utm='embeddednps'
                             className='u-posStatic'
                             fullscreen={this.props.isMobile} />
                        </div>)
                      : null;

    const ratingsList = (!this.state.currentPage.thankYou)
                      ? (<NpsRatingsList
                           isMobile={this.props.isMobile}
                           className={ratingsListClasses}
                           ratingsRange={npsRatings}
                           hideRatingsLegend={hideRatingsLegend}
                           highlightColor={this.props.survey.highlightColor}
                           likelyLabel={this.props.survey.likelyLabel}
                           notLikelyLabel={this.props.survey.notLikelyLabel}
                           selectedRating={this.props.response.rating}
                           isSubmittingComment={this.props.isSubmittingComment}
                           isSubmittingRating={this.props.isSubmittingRating}
                           onClick={this.ratingChangeValueHandler}
                           onChangeValue={this.ratingChangeValueHandler} />)
                      : null;

    const commentsContent = (<NpsComment
                               ref='npsComment'
                               isMobile={this.props.isMobile}
                               className={commentsClasses}
                               comment={this.props.response.comment}
                               feedbackPlaceholder={this.props.survey.feedbackPlaceholder}
                               isSubmittingComment={this.props.isSubmittingComment}
                               isSubmittingRating={this.props.isSubmittingRating}
                               onSubmit={this.submitCommentHandler}
                               onChange={this.props.onCommentChangeHandler} />);

    const thankYouContent = (this.state.currentPage.thankYou)
                          ? (<div className='u-textCenter'>
                               <Icon
                                 type='Icon--tick'
                                 className={iconClasses} />
                             </div>)
                          : null;

    return (
      <Container
        card={true}
        fullscreen={this.props.isMobile}
        style={containerStyles}
        className={containerClasses}>
        <div className={containerContentClasses}>
          <h1 className={surveyTitleClasses}>{surveyTitle}</h1>

          <div className={surveyFormClasses}>
            {ratingsList}
            {commentsContent}
          </div>

          {thankYouContent}

          {zendeskLogo}
        </div>
      </Container>
    );
  }
}

export { NpsDesktop };