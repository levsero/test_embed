import React from 'react/addons';
import _     from 'lodash';

import { Container } from 'component/Container';
import { NpsComment } from 'component/NpsComment';
import { Icon } from 'component/Icon';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { NpsSelectList } from 'component/NpsSelectList';
import { NpsRatingsList } from 'component/NpsRatingsList';
import { getSizingRatio } from 'utility/devices';
import { win } from 'utility/globals';

const classSet = React.addons.classSet;

export const NpsMobile = React.createClass({
  propTypes: {
    updateFrameSize: React.PropTypes.func,
    npsSender: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      currentPage: {
        selectingRating: true,
        thankYou: false,
        addingComment: false
      }
    };
  },

  calcHeightPercentage() {
    const ratio = getSizingRatio(false, false);
    const heightThreshold = 450;
    const heightRatio = win.innerHeight / ratio;

    /* jshint laxbreak: true */
    return (heightRatio < heightThreshold)
         ? (this.state.currentPage.thankYou)
           ? '60%'
           : '70%'
         : (this.state.currentPage.thankYou)
           ? '40%'
           : '51%';
  },

  setCurrentPage(page) {
    this.setState({
      currentPage: _.mapValues(
        this.getInitialState().currentPage,
        (_, key) => key === page
      )
    });
  },

  ratingClickHandler(rating) {
    let sendRating = this.props.ratingClickHandler(rating);
    return (ev) => {
      sendRating(ev, () => this.setCurrentPage('addingComment'));
    };
  },

  submitCommentHandler(ev) {
    this.props.submitCommentHandler(ev, () => this.setCurrentPage('thankYou'));
  },

  render() {
    let headingText;

    setTimeout(() => this.props.setFrameSize(
      `${win.innerWidth}px`,
      this.calcHeightPercentage()),
    0);

    if (this.state.currentPage.addingComment) {
      headingText = this.props.survey.youRated;
    } else if (this.state.currentPage.thankYou) {
      headingText = this.props.survey.thankYou;
    }

    const dropdownClasses = 'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight';

    const headingClasses = 'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight';

    const notificationClasses = `u-inlineBlock u-userTextColor
                                 u-posRelative u-marginTL u-userFillColor`;

    const npsCommentClasses = classSet({
      'u-isHidden': !this.state.currentPage.addingComment
    });

    /* jshint laxbreak: true */
    const npsRatingsList = this.state.currentPage.selectingRating
                         ? <div>
                             <p className='u-textBold u-textCenter SurveyQuestion'>
                               {this.props.survey.question}
                             </p>
                             <NpsRatingsList
                               likelyLabel={this.props.survey.likelyLabel}
                               notLikelyLabel={this.props.survey.notLikelyLabel}
                               ratingsRange={_.range(11)}
                               selectedRating={this.props.response.rating}
                               isSubmittingRating={this.props.isSubmittingRating}
                               highlightColor={this.props.survey.highlightColor}
                               onClick={this.ratingClickHandler} />
                           </div>
                         : null;

    const zendeskLogo = (!this.state.currentPage.addingComment)
                      ? <ZendeskLogo className='ZendeskLogo u-posCenter' />
                      : null;

    const notification = (this.state.currentPage.thankYou)
                       ? <div className='ThankyouTick'>
                           <Icon
                             type='Icon--tick'
                             className={notificationClasses} />
                         </div>
                       : null;

    const heading = (!this.state.currentPage.selectingRating)
                  ? <span className={headingClasses}>
                      {headingText}
                    </span>
                  : null;

    const dropdown = (this.state.currentPage.addingComment)
                   ?  <span className={dropdownClasses}>
                        <NpsSelectList
                          selectedItem={this.props.response.rating}
                          options={_.range(11)}
                          highlightColor={this.props.survey.highlightColor} />
                      </span>
                   : null;

    return (
      <Container
        className='u-borderTop Container--halfscreen'
        fullscreen={true}>
        <header className='Container--halfscreen-heading u-textCenter'>
          {heading}
          {dropdown}
        </header>
        <div className='u-marginHM u-borderTop'>
          {npsRatingsList}
          <NpsComment
            className={npsCommentClasses}
            commentsQuestion={this.props.survey.commentsQuestion}
            comment={this.props.response.comment}
            feedbackPlaceholder={this.props.survey.feedbackPlaceholder}
            onChange={this.props.onCommentChangeHandler}
            onSubmit={this.submitCommentHandler}
            highlightColor={this.props.survey.highlightColor}
            isSubmittingComment={this.props.isSubmittingComment}
          />
          {notification}
        </div>
        <footer>
          {zendeskLogo}
        </footer>
      </Container>
    );
  }
});
